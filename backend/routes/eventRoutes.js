const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  getAllEventsForAdmin,
} = require('../controllers/eventController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin routes (specific routes first)
router.get('/admin', verifyToken, authorizeRoles('Admin'), getAllEventsForAdmin);

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin actions
router.put('/:id/status', verifyToken, authorizeRoles('Admin'), approveEvent);

// Organizer routes
router.post('/', verifyToken, authorizeRoles('Organizer'), createEvent);
router.put('/:id', verifyToken, authorizeRoles('Organizer'), updateEvent);
router.delete('/:id', verifyToken, authorizeRoles('Organizer'), deleteEvent);

module.exports = router;