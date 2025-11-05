const mongoose = require("mongoose");
const Event = require("../models/Event.js");
const SwapRequest = require("../models/SwapRequest.js");

// Get all swappable slots from other users
exports.getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({
      status: "SWAPPABLE",
      owner: { $ne: req.user.id },
    });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new swap request
exports.createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mySlot = await Event.findById(mySlotId).session(session);
    const theirSlot = await Event.findById(theirSlotId).session(session);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slot not found" });

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Slots not available for swap" });

    const swap = await SwapRequest.create(
      [
        {
          requester: req.user.id,        
          offeredSlot: mySlotId,         
          requestedSlot: theirSlotId,    
          status: "PENDING",
        },
      ],
      { session }
    );

    await Event.updateMany(
      { _id: { $in: [mySlotId, theirSlotId] } },
      { status: "SWAP_PENDING", swapRequest: swap[0]._id },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(swap[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Respond to a swap request (accept or reject)
exports.respondToSwap = async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await SwapRequest.findById(requestId).session(session);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const mySlot = await Event.findById(request.requestedSlot).session(session);
    const theirSlot = await Event.findById(request.offeredSlot).session(session);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: "Slot details not found" });
    }

    if (accept) {
      // Swap owners
      const tempOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tempOwner;

      mySlot.status = "BUSY";
      theirSlot.status = "BUSY";
      request.status = "ACCEPTED";
    } else {
      // Reject swap: reset slots to SWAPPABLE
      mySlot.status = "SWAPPABLE";
      theirSlot.status = "SWAPPABLE";
      request.status = "REJECTED";
    }

    // Clear swapRequest reference
    mySlot.swapRequest = null;
    theirSlot.swapRequest = null;

    await mySlot.save({ session });
    await theirSlot.save({ session });
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(request);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// Get all swap requests for the logged-in user
exports.getAllSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ requester: req.user.id }, { requestedSlot: { $in: await Event.find({ owner: req.user.id }).distinct("_id") } }],
    })
      .populate("offeredSlot")  
      .populate("requestedSlot") 
      .populate("requester", "name email"); 

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

