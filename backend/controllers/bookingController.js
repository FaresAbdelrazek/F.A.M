const Booking = require('../models/booking');
const Event   = require('../models/Event');


exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      return next(error);
    }

    if (event.remainingTickets < numberOfTickets) {
      const error = new Error('Not enough tickets available');
      error.statusCode = 400;
      return next(error);
    }

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

    res.status(201).json({ booking });
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
    if (!booking.user.equals(req.user._id)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      return next(error);
    }

    const event = await Event.findById(booking.event);
    event.remainingTickets += booking.numberOfTickets;
    await event.save();

    booking.status = 'canceled';
    await booking.save();

    res.json({ booking });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
