// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const app = express();

// app.use(cors({
//   origin: 'https://telegramdashboardphearom.vercel.app/', //url front-end
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
  origin: process.env.ORIGIN_URL
}));

app.use(express.json());
app.use('/api/posts', postRoutes);

// Endpoint เพื่อส่ง last fetch time
app.get('/api/last-fetch-time', (req, res) => {
  try {
    if (fs.existsSync('last_fetch.txt')) {
      const lastFetch = fs.readFileSync('last_fetch.txt', 'utf8');
      res.json({ lastFetch });
    } else {
      res.json({ lastFetch: null });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last fetch time' });
  }
});

// ฟังก์ชันรัน fetchScheduled.py
const fetchData = () => {
  // ตรวจสอบคำสั่ง Python ที่ใช้งานได้
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
  const pythonProcess = spawn(pythonCommand, ['./utils/fetchScheduled.py']);
  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Fetch completed successfully');
    } else {
      console.error(`Fetch failed with code ${code}, error: ${errorOutput}`);
    }
  });
};

// ฟังก์ชันตั้งเวลาการดึงข้อมูล
const scheduleFetch = () => {
  const now = new Date(); // ปัจจุบัน: 12:56 น. UTC+07:00
  let target = new Date(now);
  target.setHours(23, 59, 0, 0); // ตั้งเป้าหมายเป็น 23:59:00 (4 นาทีจาก 12:56 น.)

  // ตรวจสอบจากไฟล์ last_scheduled.txt
  let lastScheduled = null;
  if (fs.existsSync('last_scheduled.txt')) {
    lastScheduled = new Date(fs.readFileSync('last_scheduled.txt', 'utf8'));
  }

  if (lastScheduled && now < target && lastScheduled.toDateString() === now.toDateString()) {
    console.log("Schedule already set for today, skipping");
    return;
  }

  if (now > target) {
    target.setDate(target.getDate() + 1); // ถ้าเลย 13:00 ไปแล้ว ตั้งเป็นวันถัดไป
  }

  const delay = target.getTime() - now.getTime(); // คำนวณ delay
  console.log(`Next fetch scheduled at ${target} in ${delay / 1000 / 60} minutes`);

  setTimeout(() => {
    fetchData();
    setInterval(fetchData, 24 * 60 * 60 * 1000);
    fs.writeFileSync('last_scheduled.txt', target.toISOString());
  }, delay);
};

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  scheduleFetch(); // เริ่มการตั้งเวลา
  app.listen(process.env.PORT || 5000, () => console.log('Server running on port', process.env.PORT || 5000));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;