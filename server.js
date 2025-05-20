const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS setup to allow requests from React frontend with cookies
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true                // Allow cookies and credentials
}));

app.use(express.json());

// Routes
app.use('/api/v1', require('./backend/routes/authRoutes'));
app.use('/api/v1/users', require('./backend/routes/userRoutes'));
app.use('/api/v1/events', require('./backend/routes/eventRoutes'));
app.use('/api/v1/bookings', require('./backend/routes/bookingRoutes'));

// Error handling middleware
const { errorHandler } = require('./backend/middleware/errorMiddleware');
app.use(errorHandler);

// Root route to check API status
app.get('/', (req, res) => res.send('API is running...'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
