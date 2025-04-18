
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/v1/users',    require('./backend/routes/userRoutes'));
app.use('/api/v1/events',   require('./backend/routes/eventRoutes'));
app.use('/api/v1/bookings', require('./backend/routes/bookingRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});


const { errorHandler } = require('./backend/middleware/errorMiddleware');
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
