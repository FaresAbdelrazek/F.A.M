const express = require('express');
const router  = express.Router();

const {
  getProfile,
  updateProfile,
  getUserBookings,
  getUserEvents,
  getUserEventsAnalytics,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile',           verifyToken, authorizeRoles('Standard User', 'Organizer', 'Admin'), getProfile);
router.put('/profile',           verifyToken, authorizeRoles('Standard User', 'Organizer', 'Admin'), updateProfile);

router.get('/bookings',          verifyToken, authorizeRoles('Standard User'), getUserBookings);
router.get('/events',            verifyToken, authorizeRoles('Organizer'), getUserEvents);
router.get('/events/analytics',  verifyToken, authorizeRoles('Organizer'), getUserEventsAnalytics);

router.get('/',                  verifyToken, authorizeRoles('Admin'), getAllUsers);
router.get('/:id',               verifyToken, authorizeRoles('Admin'), getUserById);
router.put('/:id',               verifyToken, authorizeRoles('Admin'), updateUserRole);
router.delete('/:id',            verifyToken, authorizeRoles('Admin'), deleteUser);

module.exports = router;
