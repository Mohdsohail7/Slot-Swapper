const express = require("express");
const { getSwappableSlots, createSwapRequest, respondToSwap, getAllSwapRequests } = require("../controllers/swapController.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", auth, getAllSwapRequests);
router.get("/swappable-slots", auth, getSwappableSlots);
router.post("/swap-request", auth, createSwapRequest);
router.post("/swap-response/:requestId", auth, respondToSwap);

module.exports = router;
