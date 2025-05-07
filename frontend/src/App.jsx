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
    <div className="flex flex-col min-h-screen w-full bg-gray-100 p-6 justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">📊 Telegram Monthly Views Dashboard</h1>
      <div className='max-w-7xl'>
        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">ยอดวิวรายเดือน</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyViews}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="totalViews" stroke="#3b82f6" name="Total Views" />
              <Line type="monotone" dataKey="totalPosts" stroke="#10b981" name="Total Posts" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">📌 โพสต์ยอดนิยม</h2>
          <ul className="divide-y">
            {topPosts.map((post, i) => (
              <li key={i} className="py-2">
                📄 Post ID: {post.message_id} — 👁️ {post.views} views
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
