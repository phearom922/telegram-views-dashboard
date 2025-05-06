import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import TelegramPostEmbed from './TelegramPostEmbed'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts/monthly').then(res => setMonthlyViews(res.data));
    axios.get('http://localhost:5000/api/posts/top').then(res => setTopPosts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Telegram Monthly Views Dashboard</h1>

      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">ยอดวิวรายเดือน</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyViews}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="totalViews" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">📌 โพสต์ยอดนิยม</h2>
        <div className="grid gap-4">
          {topPosts.map((post, i) => (
            <div key={i} className="w-full">
              <TelegramPostEmbed
                key={i}
                channelUsername={post.channel_username}
                messageId={post.message_id}
              />
              <p className="text-sm text-gray-600 mt-1">👁️ {post.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
