const Booking = require('../models/Booking');
const Event = require('../models/Event');


exports.bookTickets = async (req, res) => {
  const { eventId, numberOfTickets } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (numberOfTickets > event.remainingTickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
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
    res.status(500).json({ message: "Error booking tickets" });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.user) !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to cancel this booking" });
    }

    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking already canceled" });
    }

    
    const event = booking.event;
    event.remainingTickets += booking.numberOfTickets;
    await event.save();

    booking.status = "canceled";
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error canceling booking" });
  }
};
