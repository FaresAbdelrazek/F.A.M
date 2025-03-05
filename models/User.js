const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Standard User", "Organizer", "Admin"],
    default: "Standard User",
  },
}, { timestamps: true }); 

const User = mongoose.model("User", userSchema);
module.exports = User;
