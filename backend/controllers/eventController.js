const Event = require('../models/Event');

// Public: Get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// Organizer: Create an event
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id,
      remainingTickets: req.body.totalTickets
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// Organizer/Admin: Update event
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(event.organizer) !== req.user.id && req.user.role !== "Admin") {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      return next(error);
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// Organizer/Admin: Delete event
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(event.organizer) !== req.user.id && req.user.role !== "Admin") {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      return next(error);
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};

// Organizer: Get events created by logged-in user
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// Organizer: Analytics - % tickets booked
exports.getAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const analytics = events.map(event => {
      const sold = event.totalTickets - event.remainingTickets;
      const percentage = ((sold / event.totalTickets) * 100).toFixed(2);
      return {
        title: event.title,
        sold: `${percentage}% tickets booked`
      };
    });

    res.status(200).json(analytics);
  } catch (err) {
    next(err);
  }
};
