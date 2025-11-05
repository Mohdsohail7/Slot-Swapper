const express = require("express");
const { createEvent, getMyEvents, updateEventStatus } =  require("../controllers/eventController.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", auth, createEvent);
router.get("/", auth, getMyEvents);
router.patch("/:id/status", auth, updateEventStatus);

module.exports = router;
