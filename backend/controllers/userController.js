const User   = require('../models/User');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.status(201).json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getProfile = (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No account with that email' });
    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    res.json({ msg: 'Password has been reset' });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const Event = require('../models/Event');
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await require('./bookingController').getUserBookings(req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.getUserEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    res.json({ events });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getUserEventsAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const analytics = events.map(e => ({
      eventId: e._id,
      title: e.title,
      percentBooked: Math.round(((e.totalTickets - e.remainingTickets) / e.totalTickets) * 100)
    }));
    res.json({ analytics });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      const error = new Error('User not found'); error.statusCode = 404; return next(error);
    }
    res.json({ user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      const error = new Error('User not found'); error.statusCode = 404; return next(error);
    }
    res.json({ user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
