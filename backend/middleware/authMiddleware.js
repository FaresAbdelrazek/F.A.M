
const jwt  = require('jsonwebtoken');
const User = require('../models/User');


exports.verifyToken = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer?.startsWith('Bearer '))
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const token = bearer.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


exports.authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ msg: 'Forbidden: insufficient role' });
  next();
};
