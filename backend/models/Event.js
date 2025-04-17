
const mongoose = require("mongoose"); 

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  remainingTickets: { type: Number, required: true },


  status: {
    type: String,
    enum: ["approved", "pending", "declined"],
    default: "pending",
  },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
