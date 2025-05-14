import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TelegramWidget from './TelegramWidget';
import { LuExternalLink } from "react-icons/lu";
import { AiFillPicture } from "react-icons/ai";
import { FaRegEye, FaMoon, FaSun } from "react-icons/fa";
import scmLogo from "../public/scm-logo.jpg"



function App() {
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // ตรวจสอบค่าใน localStorage เมื่อเริ่มต้นแอป
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // บันทึกสถานะ Dark Mode ลงใน localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // เพิ่ม/ลบ class 'dark' จาก document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [monthlyRes, topRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_KEY + '/posts/monthly'),
        axios.get(import.meta.env.VITE_API_KEY + '/posts/top')
      ]);
      console.log('Monthly Views:', monthlyRes.data);
      console.log('Top Posts:', topRes.data);
      setMonthlyViews(monthlyRes.data);
      setTopPosts(topRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
    setLoading(false);
  };


const handleUpdate = async () => {
    const now = new Date();
    // ตรวจสอบว่า fetch ล่าสุดเมื่อกี่วินาทีที่แล้ว (เช่น ไม่ให้ fetch ใหม่ถ้าผ่านไปแค่ 5 นาที)
    if (lastFetchTime && (now - lastFetchTime) < 5 * 60 * 1000) {
      console.log("Too soon to fetch again. Please wait.");
      return;
    }

    setLoading(true);
    try {
      await axios.get(import.meta.env.VITE_API_KEY + '/posts/fetch-now');
      setLastFetchTime(now);
      await fetchData(); // อัพเดทข้อมูลใน frontend
    } catch (error) {
      console.error('Error updating data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={`min-h-screen w-full p-6 transition-colors duration-300 ${darkMode ? 'dark:bg-gray-900 bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Telegram Dashboard</h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Monitor your channel performance</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`px-5 py-2.5 ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-medium rounded cursor-pointer shadow-md transition-all flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Fetch Latest Data'}
              </button>
            </div>
          </div>




          <div className="grid grid-cols-1 lg:grid-cols-3 space-y-6 sm:gap-0 lg:gap-6 lg:space-y-0 mb-6">
            <div className={`p-6 rounded-2xl shadow-sm col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-2">Monthly Trends</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Views and posts over time</p>
              {monthlyViews.length === 0 ? (
                <div className={`h-64 flex items-center justify-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No data to display</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyViews}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} vertical={false} />
                      <XAxis
                        dataKey="_id"
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => {
                          const [year, month] = value.split('-');
                          const date = new Date(year, month - 1);
                          return date.toLocaleString('default', { month: 'short' });
                        }}
                      />
                      <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : 'white',
                          color: darkMode ? 'white' : 'black',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none',
                          fontSize: '14px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalViews"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981' }}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: darkMode ? '#1f2937' : 'white' }}
                        name="Total Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="totalPosts"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6' }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: darkMode ? '#1f2937' : 'white' }}
                        name="Total Posts"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent performance metrics</p>

              {monthlyViews.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-teal-900 bg-opacity-30' : 'bg-teal-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Total Views (Last Month)</p>
                    <p className="text-2xl font-bold">{monthlyViews[monthlyViews.length - 1]?.totalViews || 0}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Total Posts (Last Month)</p>
                    <p className="text-2xl font-bold">{monthlyViews[monthlyViews.length - 1]?.totalPosts || 0}</p>
                  </div>
                </div>
              )}

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} pt-4`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Post View</h3>
                {topPosts.length > 0 && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${darkMode ? 'bg-teal-900 text-teal-300' : 'bg-teal-100 text-teal-800'}`}>#1</span>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Post {topPosts[0].message_id}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaRegEye className="mr-1" /> {topPosts[0].views} views
                      </span>
                      <a
                        href={topPosts[0].url}
                        target="_blank"
                        className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                      >
                        View <LuExternalLink className="ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 space-y-6 lg:gap-6 lg:space-y-0 mb-6">
            <div className={`p-6 rounded-2xl shadow-sm col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-2">Top Posts</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ranked by view count</p>

              <div className="overflow-x-auto">
                <table className={`divide-y min-w-full ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Rank</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Post</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Views</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Action</th>
                    </tr>
                  </thead>

                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {topPosts.map((post, i) => (
                      <tr key={i} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{i + 1}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          <span className='flex items-center gap-2'>
                            <AiFillPicture className={darkMode ? "text-gray-500" : "text-gray-400"} />
                            {"Post ID : " + post.message_id}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          <span className='flex items-center gap-2'>
                            <FaRegEye className={darkMode ? "text-gray-500" : "text-gray-400"} />
                            {post.views}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={post.url}
                            target="_blank"
                            className={`inline-flex items-center font-medium ${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                          >
                            Open <LuExternalLink className="ml-1" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-2">Successmore Cambodia Official</h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Telegram Chanel</p>
              <div>
                <img className='rounded-[10px]' src={scmLogo} alt="Successmore Cambodia" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;