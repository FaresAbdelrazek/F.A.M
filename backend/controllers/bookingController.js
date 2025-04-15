const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.bookTickets = async (req, res, next) => {
  const { eventId, numberOfTickets } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      return next(error);
    }

    if (numberOfTickets > event.remainingTickets) {
      const error = new Error("Not enough tickets available");
      error.statusCode = 400;
      return next(error);
    }

    const totalPrice = event.ticketPrice * numberOfTickets;

    
    const booking = await Booking.create({
      user: req.user.id,
      event: event._id,
      numberOfTickets,
      totalPrice,
      status: "confirmed"
    });


    event.remainingTickets -= numberOfTickets;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    next(err); // Pass error to global handler
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event");
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(booking.user) !== req.user.id) {
      const error = new Error("Not allowed to cancel this booking");
      error.statusCode = 403;
      return next(error);
    }

    if (booking.status === "canceled") {
      const error = new Error("Booking already canceled");
      error.statusCode = 400;
      return next(error);
    }


    const event = booking.event;
    event.remainingTickets += booking.numberOfTickets;
    await event.save();

    booking.status = "canceled";
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    next(err);
  }
};
