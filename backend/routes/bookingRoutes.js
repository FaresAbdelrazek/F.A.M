const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingById
} = require("../controllers/bookingController");

const auth = require("../middleware/authenticationMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

// ✅ Book tickets for an event
router.post("/", auth, authorize("Standard User"), createBooking);

// ✅ View current user's bookings
router.get("/", auth, authorize("Standard User"), getMyBookings);

// ✅ Cancel a booking by ID
router.delete("/:id", auth, authorize("Standard User"), cancelBooking);

// ✅ (Optional) View a specific booking
router.get("/:id", auth, authorize("Standard User"), getBookingById);

module.exports = router;
