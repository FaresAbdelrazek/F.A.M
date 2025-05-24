const Event = require("../models/Event");
const Booking = require("../models/booking");

// Create Event - FIXED VERSION
exports.createEvent = async (req, res, next) => {
  try {
    console.log('Creating event with data:', req.body);
    
    // Ensure all required fields are present
    const { title, description, date, location, category, ticketPrice, totalTickets } = req.body;
    
    if (!title || !description || !date || !location || !category || !ticketPrice || !totalTickets) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // Validate numeric fields
    if (isNaN(ticketPrice) || ticketPrice < 0) {
      const error = new Error("Ticket price must be a valid positive number");
      error.statusCode = 400;
      return next(error);
    }

    if (isNaN(totalTickets) || totalTickets < 1) {
      const error = new Error("Total tickets must be a valid positive number");
      error.statusCode = 400;
      return next(error);
    }

    // Validate date
    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      const error = new Error("Event date cannot be in the past");
      error.statusCode = 400;
      return next(error);
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      location: location.trim(),
      category: category.trim(),
      ticketPrice: parseFloat(ticketPrice),
      totalTickets: parseInt(totalTickets),
      remainingTickets: parseInt(totalTickets), // Explicitly set remainingTickets
      organizer: req.user._id,
      status: "pending"
    };

    console.log('Event data to save:', eventData);

    const event = await Event.create(eventData);
    
    // Populate the organizer information before sending response
    const populatedEvent = await Event.findById(event._id).populate('organizer', 'name email');
    
    res.status(201).json({ 
      event: populatedEvent,
      message: "Event created successfully and is pending approval"
    });
  } catch (err) {
    console.error('Create event error:', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: "approved" };
    const events = await Event.find(filter).populate('organizer', 'name email');
    res.json({ events });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getAllEventsForAdmin = async (req, res, next) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json({ events });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
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

    const allowed = ["title", "description", "date", "location", "totalTickets", "ticketPrice", "category"];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
        // If totalTickets is updated, adjust remainingTickets proportionally
        if (field === 'totalTickets') {
          const bookedTickets = event.totalTickets - event.remainingTickets;
          event.remainingTickets = Math.max(0, req.body[field] - bookedTickets);
        }
      }
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

    // Delete all bookings associated with this event
    await Booking.deleteMany({ event: req.params.id });
    
    // Delete the event
    await Event.deleteOne({ _id: req.params.id });
    
    res.json({ 
      message: "Event and all associated bookings deleted successfully" 
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.approveEvent = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['approved', 'declined', 'pending'];
    
    if (status && !validStatuses.includes(status)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      return next(error);
    }

    const updateStatus = status || 'approved';
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: updateStatus },
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