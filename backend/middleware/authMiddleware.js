const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token ? 'Present' : 'Missing');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    console.log('Authenticated user:', req.user.name, 'Role:', req.user.role);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('Checking roles:', allowedRoles, 'User role:', req.user?.role);
    
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('Role not authorized:', req.user.role, 'Required:', allowedRoles);
      return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    }
    
    console.log('Role authorized:', req.user.role);
    next();
  };
};