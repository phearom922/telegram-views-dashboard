import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TelegramWidget from './TelegramWidget';
import { LuExternalLink } from "react-icons/lu";
import { AiFillPicture } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
function App() {
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // frontend/src/App.jsx
  const fetchData = async () => {
    setLoading(true);
    try {
      const [monthlyRes, topRes] = await Promise.all([
        axios.get('http://localhost:5000/api/posts/monthly'),
        axios.get('http://localhost:5000/api/posts/top')
      ]);
      console.log('Monthly Views:', monthlyRes.data); // เพิ่ม log
      console.log('Top Posts:', topRes.data); // เพิ่ม log
      setMonthlyViews(monthlyRes.data);
      setTopPosts(topRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
    setLoading(false);
  };

  // frontend/src/App.jsx
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.get('http://localhost:5000/api/posts/fetch-now');
      await fetchData(); // ดึงข้อมูลใหม่ทันที
    } catch (error) {
      console.error('Error updating data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);


  console.log(topPosts)

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 p-6 justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">📊 Telegram Monthly Views Dashboard</h1>
      <button onClick={handleUpdate} disabled={loading} className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow">
        {loading ? 'Updating...' : 'Update Now'}
      </button>
      <div className='max-w-7xl'>
        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Monthly views</h2>
          {monthlyViews.length === 0 ? (
            <p className="text-gray-500">No data available for the last 3 months.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyViews}>
                <XAxis
                  dataKey="_id"
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    const date = new Date(year, month - 1);
                    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
                  }}
                />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="totalViews" stroke="#3b82f6" name="Total Views" />
                <Line type="monotone" dataKey="totalPosts" stroke="#f59e0b" name="Total Posts" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Popular Post</h2>
          <ul className="divide-y ">
            {topPosts.map((post, i) => (
              <li key={i} className="py-3 flex gap-4 items-center">
                <AiFillPicture className='text-gray-500'/> Post ID: {post.message_id} — <FaRegEye className='text-gray-500'/> {post.views} views <a target='_blank' href={post.url}><LuExternalLink /></a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;