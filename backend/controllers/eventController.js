
const Event = require("../models/Event");


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });


    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


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
