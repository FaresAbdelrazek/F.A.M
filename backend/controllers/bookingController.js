const Booking = require('../models/booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    
    // Validate input
    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      const error = new Error('Invalid booking data');
      error.statusCode = 400;
      return next(error);
    }

    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if event is approved
    if (event.status !== 'approved') {
      const error = new Error('Event is not available for booking');
      error.statusCode = 400;
      return next(error);
    }

    // Check ticket availability
    if (event.remainingTickets < numberOfTickets) {
      const error = new Error(`Only ${event.remainingTickets} tickets available`);
      error.statusCode = 400;
      return next(error);
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      const error = new Error('Cannot book tickets for past events');
      error.statusCode = 400;
      return next(error);
    }

    // Update event ticket count
    event.remainingTickets -= numberOfTickets;
    await event.save();

    const totalPrice = numberOfTickets * event.ticketPrice;
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      numberOfTickets,
      totalPrice,
      status: 'confirmed',
    });

    // Populate the booking with event details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date location ticketPrice')
      .populate('user', 'name email');

    res.status(201).json({ 
      booking: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location ticketPrice')
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title date location ticketPrice')
      .populate('user', 'name email');
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Check if the booking belongs to the current user
    if (!booking.user._id.equals(req.user._id)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      return next(error);
    }

    res.json({ booking });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Check if the booking belongs to the current user
    if (!booking.user.equals(req.user._id)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      return next(error);
    }

    // Check if booking is already canceled
    if (booking.status === 'canceled') {
      const error = new Error('Booking is already canceled');
      error.statusCode = 400;
      return next(error);
    }

    // Return tickets to the event
    const event = await Event.findById(booking.event);
    if (event) {
      event.remainingTickets += booking.numberOfTickets;
      await event.save();
    }

    // Update booking status
    booking.status = 'canceled';
    await booking.save();

    // Return updated booking with event details
    const updatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date location ticketPrice');

    res.json({ 
      booking: updatedBooking,
      message: 'Booking canceled successfully'
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};