import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiPlus, HiTrash, HiEye, HiChevronLeft, HiChevronRight, 
  HiChartPie, HiPresentationChartLine, HiTrendingUp, HiExclamation,
  HiClock, HiBeaker
} from 'react-icons/hi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ predictions: [], totalCount: 0 });
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const diseaseFilter = filter === 'All' || filter === 'HighRisk' ? '' : filter;
        const riskFilter = filter === 'HighRisk' ? 'High' : '';
        
        const res = await axios.get(`/api/history`, {
          params: { page, limit: 10, disease: diseaseFilter, riskLevel: riskFilter }
        });
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, filter]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this health record?')) {
      try {
        await axios.delete(`/api/history/${id}`);
        toast.success('Record deleted');
        setData(prev => ({
          ...prev,
          predictions: prev.predictions.filter(p => p._id !== id),
          totalCount: prev.totalCount - 1
        }));
      } catch (err) {
        toast.error('Failed to delete record');
      }
    }
  };

  // Stats Aggregation
  const stats = useMemo(() => {
    const total = data.totalCount || 0;
    const highRisk = data.predictions.filter(p => p.primaryDisease.severity === 'High' || p.primaryDisease.probability > 70).length;
    const lastCheck = data.predictions[0]?.createdAt ? new Date(data.predictions[0].createdAt).toLocaleDateString() : 'N/A';
    return { total, highRisk, score: 75, lastCheck };
  }, [data]);

  // Chart Data Preparation
  const lineData = useMemo(() => {
    return [...data.predictions].reverse().map(p => ({
      date: new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: 75 // Mock score as it's not in the model yet but requested in UI
    }));
  }, [data.predictions]);

  const pieData = [
    { name: 'Low Risk', value: data.predictions.filter(p => p.primaryDisease.probability <= 30).length, color: '#22c55e' },
    { name: 'Medium Risk', value: data.predictions.filter(p => p.primaryDisease.probability > 30 && p.primaryDisease.probability <= 60).length, color: '#eab308' },
    { name: 'High Risk', value: data.predictions.filter(p => p.primaryDisease.probability > 60).length, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const filterOptions = [
    'All', 'Diabetes', 'Heart', 'Kidney', 'Liver', 'Hypertension', 'HighRisk'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Health Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, {user?.name}. Monitor your clinical progress.</p>
          </div>
          <Link 
            to="/predict" 
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-1 active:scale-95"
          >
            <HiPlus className="w-5 h-5" />
            <span>New Prediction</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Assessments', val: stats.total, icon: <HiBeaker />, color: 'bg-blue-600' },
            { label: 'High Risk Flags', val: stats.highRisk, icon: <HiExclamation />, color: 'bg-red-500' },
            { label: 'Avg Health Score', val: stats.score, icon: <HiTrendingUp />, color: 'bg-green-500' },
            { label: 'Last Checkup', val: stats.lastCheck, icon: <HiClock />, color: 'bg-indigo-600' }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className={`w-12 h-12 ${s.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {s.icon}
              </div>
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</span>
                <span className="text-2xl font-black text-gray-900">{s.val}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-50/50">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                   <HiPresentationChartLine className="text-blue-500" />
                   <span>Health Score Trend</span>
                </h3>
             </div>
             <div className="h-[300px] w-full">
                {lineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} dot={{r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-gray-300 font-bold italic">Insufficient data for trend analysis</div>}
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-50/50">
             <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2 mb-8">
                <HiChartPie className="text-indigo-500" />
                <span>Risk Distribution</span>
             </h3>
             <div className="h-[300px] w-full">
                {pieData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '20px'}} />
                      </PieChart>
                   </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-gray-300 font-bold italic text-center">No assessments found</div>}
             </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex overflow-x-auto pb-4 mb-4 space-x-2 scrollbar-hide">
           {filterOptions.map(opt => (
             <button
               key={opt}
               onClick={() => { setFilter(opt); setPage(1); }}
               className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                 filter === opt 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
               }`}
             >
               {opt === 'HighRisk' ? '⚠️ High Risk' : opt}
             </button>
           ))}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
           {loading ? (
             <div className="p-20 flex justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
           ) : data.predictions.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-100 text-left">
                  <thead className="bg-gray-50">
                    <tr>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Disease</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Risk %</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Severity</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Health Score</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.predictions.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition duration-300">
                        <td className="px-8 py-6">
                           <span className="block text-sm font-bold text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</span>
                           <span className="text-[10px] text-gray-400 font-bold">#{p._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-black text-gray-900">{p.primaryDisease.name}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-2">
                             <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600" style={{width: `${p.primaryDisease.probability}%`}}></div>
                             </div>
                             <span className="text-sm font-black text-gray-900">{p.primaryDisease.probability}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                             p.primaryDisease.severity === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                           }`}>
                             {p.primaryDisease.severity}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-black text-gray-900">75/100</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end space-x-3">
                              <button 
                                onClick={() => navigate(`/result/${p._id}`)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                              >
                                <HiEye className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(p._id)}
                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"
                              >
                                <HiTrash className="w-5 h-5" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           ) : (
             <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mx-auto mb-6">
                   <span className="text-5xl">Empty</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No predictions yet</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-8 font-medium">Start your first health assessment to see your analytics and patterns here.</p>
                <Link to="/predict" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
                   <span>Make First Prediction</span>
                </Link>
             </div>
           )}

           {/* Pagination */}
           {data.totalPages > 1 && (
             <div className="px-8 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {page} of {data.totalPages}</p>
                <div className="flex space-x-2">
                   <button 
                     disabled={page === 1}
                     onClick={() => setPage(page - 1)}
                     className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-50 transition"
                   >
                     <HiChevronLeft className="w-5 h-5" />
                   </button>
                   <button 
                     disabled={page === data.totalPages}
                     onClick={() => setPage(page + 1)}
                     className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-50 transition"
                   >
                     <HiChevronRight className="w-5 h-5" />
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
