require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(cors({
  origin: process.env.ORIGIN_URL
}));
app.use(express.json());
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
