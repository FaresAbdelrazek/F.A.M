const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.post('/', verifyToken, authorizeRoles('Standard User'), createBooking);
router.get('/', verifyToken, authorizeRoles('Standard User'), getUserBookings);
router.get('/:id', verifyToken, authorizeRoles('Standard User'), getBookingById);
router.delete('/:id', verifyToken, authorizeRoles('Standard User'), cancelBooking);

module.exports = router;