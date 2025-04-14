const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getAnalytics,
} = require("../controllers/eventController");

const auth = require("../middleware/authenticationMiddleware");
const authorize = require("../middleware/authorizationMiddleware");


router.get("/", getAllEvents);


router.post("/", auth, authorize("Organizer"), createEvent);
router.put("/:id", auth, authorize("Organizer", "Admin"), updateEvent);
router.delete("/:id", auth, authorize("Organizer", "Admin"), deleteEvent);
router.get("/my/events", auth, authorize("Organizer"), getMyEvents);
router.get("/my/analytics", auth, authorize("Organizer"), getAnalytics);

module.exports = router;
