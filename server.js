const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const userRoutes = require("./backend/routes/userRoutes");
app.use('/api/v1/users', userRoutes);

const eventRoutes = require('./backend/routes/eventRoutes')
app.use('/api/v1/events', eventRoutes);

const bookingRoutes = require('./backend/routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);
