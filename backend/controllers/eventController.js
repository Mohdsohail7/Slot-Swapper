const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    const event = await Event.create({
      title,
      startTime,
      endTime,
      owner: req.user.id, 
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.id }); 
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, owner: req.user.id },  
      { status },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

