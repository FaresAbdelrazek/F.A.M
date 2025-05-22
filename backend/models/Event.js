const mongoose = require("mongoose"); 

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  remainingTickets: { 
    type: Number, 
    required: true
  },

  status: {
    type: String,
    enum: ["approved", "pending", "declined"],
    default: "pending",
  },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Pre-save middleware to ensure remainingTickets is set
eventSchema.pre('save', function(next) {
  // If this is a new document and remainingTickets is not set, set it to totalTickets
  if (this.isNew && (this.remainingTickets === undefined || this.remainingTickets === null)) {
    this.remainingTickets = this.totalTickets;
  }
  
  // Ensure remainingTickets never exceeds totalTickets
  if (this.remainingTickets > this.totalTickets) {
    this.remainingTickets = this.totalTickets;
  }
  
  // Ensure remainingTickets is never negative
  if (this.remainingTickets < 0) {
    this.remainingTickets = 0;
  }
  
  next();
});

module.exports = mongoose.model("Event", eventSchema);