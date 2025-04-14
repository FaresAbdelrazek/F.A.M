const Event = require('../models/Event');

// 🔓 Public: Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// 📝 Organizer: Create event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id,
      remainingTickets: req.body.totalTickets // initialize
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
};

// 🛠 Organizer: Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only the organizer can update it
    if (String(event.organizer) !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating event" });
  }
};

// ❌ Organizer: Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (String(event.organizer) !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

// 👤 Organizer: Get my events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your events" });
  }
};

// 📊 Organizer: Event analytics
exports.getAnalytics = async (req, res) => {
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
    res.status(500).json({ message: "Error calculating analytics" });
  }
};
