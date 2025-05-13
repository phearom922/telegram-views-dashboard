require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const { spawn } = require('child_process');

const app = express();
app.use(cors({
  origin: process.env.ORIGIN_URL
}));
app.use(express.json());
app.use('/api/posts', postRoutes);

app.get('/api/posts/fetch-now', (req, res) => {
  const pythonProcess = spawn('python', ['utils/fetchTelegramData.py']);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ status: 'done', output });
    } else {
      res.status(500).json({ status: 'error', message: 'Python script failed' });
    }
  });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
