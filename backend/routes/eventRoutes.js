// backend/routes/eventRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
} = require('../controllers/eventController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/',       getAllEvents);
router.get('/:id',    getEventById);

// ── Organizer only ───────────────────────────────────────────────────────────
router.post(   '/',    verifyToken, authorizeRoles('Organizer'), createEvent);
router.put(    '/:id', verifyToken, authorizeRoles('Organizer'), updateEvent);
router.delete( '/:id', verifyToken, authorizeRoles('Organizer'), deleteEvent);

// ── Admin only approval/rejection ────────────────────────────────────────────
router.patch('/:id/approve', verifyToken, authorizeRoles('Admin'), approveEvent);
router.patch('/:id/reject',  verifyToken, authorizeRoles('Admin'),  rejectEvent);

module.exports = router;
