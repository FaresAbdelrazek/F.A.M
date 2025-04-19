const Event = require("../models/Event");

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json({ events });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ event });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const data = { ...req.body, organizer: req.user._id };
    const event = await Event.create(data);
    res.status(201).json({ event });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }
    if (!event.organizer.equals(req.user._id)) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      return next(error);
    }
    const allowed = ["date", "location", "totalTickets", "ticketPrice"];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });
    await event.save();
    res.json({ event });
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }
    if (!event.organizer.equals(req.user._id)) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      return next(error);
    }
    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Event deleted" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ event });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.rejectEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "declined" },
      { new: true }
    );
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ event });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
