const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getMyEvents,
  getAllEventsForAdmin,
} = require('../controllers/eventController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/admin', verifyToken, authorizeRoles('Admin'), getAllEventsForAdmin);
router.get('/my-events', verifyToken, authorizeRoles('Organizer'), getMyEvents);
router.get('/:id', getEventById);

// Organizer routes
router.post('/', verifyToken, authorizeRoles('Organizer'), createEvent);
router.put('/:id', verifyToken, authorizeRoles('Organizer'), updateEvent);
router.delete('/:id', verifyToken, authorizeRoles('Organizer'), deleteEvent);

// Admin routes
router.put('/:id/status', verifyToken, authorizeRoles('Admin'), approveEvent);
router.patch('/:id/approve', verifyToken, authorizeRoles('Admin'), approveEvent);
router.patch('/:id/reject', verifyToken, authorizeRoles('Admin'), rejectEvent);

module.exports = router;
