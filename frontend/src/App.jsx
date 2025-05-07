import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TelegramWidget from './TelegramWidget';
import { LuExternalLink } from "react-icons/lu";


function App() {
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [monthlyRes, topRes] = await Promise.all([
        axios.get('http://localhost:5000/api/posts/monthly'),
        axios.get('http://localhost:5000/api/posts/top')
      ]);
      setMonthlyViews(monthlyRes.data);
      setTopPosts(topRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.get('http://localhost:5000/api/posts/fetch-now');
      await fetchData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //===================
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://telegram.org/js/telegram-widget.js?22';
  //   script.setAttribute('data-telegram-post', 'SuccessmoreCambodiaOfficial/3250');
  //   script.setAttribute('data-width', '30%');
  //   script.async = true;
  //   document.body.appendChild(script);

  //   // return () => {
  //   //   // document.body.removeChild(script); // Cleanup
  //   // };
  // }, []);





  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 p-6 justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">📊 Telegram Monthly Views Dashboard</h1>
      <button onClick={handleUpdate} disabled={loading} className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow">
        {loading ? 'Updating...' : 'Update Now'}
      </button>
      <div className='max-w-7xl'>
        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Monthly views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyViews}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="totalViews" stroke="#3b82f6" />
              <Line type="monotone" dataKey="totalPosts" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 min-w-7xl rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Popular Post</h2>
          <ul className="divide-y ">
            {topPosts.map((post, i) => (
              <li key={i} className="py-2 flex gap-4 items-center">
                📄 Post ID: {post.message_id} — 👁️ {post.views} views <LuExternalLink  />
                <TelegramWidget postId={post.message_id} />
              </li>

            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;