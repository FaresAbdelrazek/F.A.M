// controllers/eventController.js
const Event = require("../models/Event");

// @desc    Get all approved events (public)
// @route   GET /api/v1/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get one event by ID (public if approved, or organizer/admin)
// @route   GET /api/v1/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Only approved, or if requester is organizer/admin (we’ll check in route)
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Create a new event (organizer)
// @route   POST /api/v1/events
exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body, organizer: req.user._id };
    const event = await Event.create(data);
    res.status(201).json({ event });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Invalid data" });
  }
};

// @desc    Update an event (organizer only on own event)
// @route   PUT /api/v1/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    if (!event.organizer.equals(req.user._id))
      return res.status(403).json({ msg: "Forbidden" });

    // allow editing only certain fields
    const allowed = ["date","location","totalTickets","ticketPrice"];
    allowed.forEach(f => {
      if (req.body[f] !== undefined) event[f] = req.body[f];
    });
    await event.save();
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Invalid data" });
  }
};

// @desc    Delete an event (organizer only on own event)
// @route   DELETE /api/v1/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    if (!event.organizer.equals(req.user._id))
      return res.status(403).json({ msg: "Forbidden" });

    await event.remove();
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Approve an event (admin only)
// @route   PATCH /api/v1/events/:id/approve
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Reject an event (admin only)
// @route   PATCH /api/v1/events/:id/reject
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "declined" },
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
