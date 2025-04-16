const express = require("express");
const router = express.Router();

const {
  bookTickets,  // ✅ This must match your controller!
  getMyBookings,
  cancelBooking,
  getBookingById
} = require("../controllers/bookingController");

const auth = require("../middleware/authenticationMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

// ✅ Book tickets for an event
router.post("/", auth, authorize("Standard User"), bookTickets);

// ✅ View current user's bookings
router.get("/", auth, authorize("Standard User"), getMyBookings);

// ✅ Cancel a booking by ID
router.delete("/:id", auth, authorize("Standard User"), cancelBooking);

// ✅ View a specific booking
router.get("/:id", auth, authorize("Standard User"), getBookingById);

module.exports = router;
