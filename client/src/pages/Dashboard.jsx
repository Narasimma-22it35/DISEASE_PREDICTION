import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  HiPlus, HiTrash, HiEye, HiChevronLeft, HiChevronRight,
  HiChartPie, HiPresentationChartLine, HiTrendingUp, HiExclamation,
  HiClock, HiBeaker, HiSparkles
} from 'react-icons/hi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

const severityConfig = {
  High:     { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30',    dot: 'bg-red-400' },
  Medium:   { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  Low:      { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30',  dot: 'bg-green-400' },
  Critical: { bg: 'bg-rose-500/15',   text: 'text-rose-400',   border: 'border-rose-500/30',   dot: 'bg-rose-400' },
};

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
        const res = await axios.get('/api/history', {
          params: { page, limit: 10, disease: diseaseFilter, riskLevel: riskFilter }
        });
        setData(res.data);
      } catch {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this health record permanently?')) return;
    try {
      await axios.delete(`/api/history/${id}`);
      toast.success('Record deleted');
      setData(prev => ({
        ...prev,
        predictions: prev.predictions.filter(p => p._id !== id),
        totalCount: prev.totalCount - 1
      }));
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const stats = useMemo(() => {
    const total    = data.totalCount || 0;
    const highRisk = data.predictions.filter(p =>
      p.primaryDisease?.severity === 'High' || p.primaryDisease?.probability > 70
    ).length;
    const lastCheck = data.predictions[0]?.createdAt
      ? new Date(data.predictions[0].createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'N/A';
    return { total, highRisk, score: 75, lastCheck };
  }, [data]);

  const lineData = useMemo(() =>
    [...data.predictions].reverse().map(p => ({
      date: new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: 75
    })), [data.predictions]);

  const pieData = [
    { name: 'Low Risk',    value: data.predictions.filter(p => p.primaryDisease?.probability <= 30).length,                                                                 color: '#22c55e' },
    { name: 'Medium Risk', value: data.predictions.filter(p => p.primaryDisease?.probability > 30 && p.primaryDisease?.probability <= 60).length, color: '#eab308' },
    { name: 'High Risk',   value: data.predictions.filter(p => p.primaryDisease?.probability > 60).length,                                                                  color: '#ef4444' },
  ].filter(d => d.value > 0);

  const filterOptions = ['All', 'Diabetes', 'Heart', 'Kidney', 'Liver', 'Hypertension', 'HighRisk'];

  const statCards = [
    { label: 'Total Assessments', val: stats.total,     icon: '🔬', gradient: 'from-blue-600 to-indigo-700',    glow: 'shadow-blue-500/25' },
    { label: 'High-Risk Flags',   val: stats.highRisk,  icon: '⚠️', gradient: 'from-red-500 to-rose-600',       glow: 'shadow-red-500/25'  },
    { label: 'Avg Health Score',  val: `${stats.score}/100`, icon: '💚', gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/25' },
    { label: 'Last Checkup',      val: stats.lastCheck, icon: '📅', gradient: 'from-violet-600 to-purple-700',  glow: 'shadow-violet-500/25' },
  ];

  return (
    <div className="min-h-screen bg-[#070818] text-white">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0e2b] via-[#0a1040] to-[#070818] border-b border-white/5">
        {/* ORB decorations */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 right-40 w-72 h-72 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div {...fadeUp(0)}>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-400/80">Health Analytics</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-bold">Live</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Welcome back, <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.name?.split(' ')[0]} 👋
                </span>
              </h1>
              <p className="text-gray-400 font-medium mt-2">Monitor your clinical progress and health trends below.</p>
            </motion.div>

            <motion.div {...fadeUp(0.15)}>
              <Link to="/predict"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-1 active:scale-95"
              >
                <span className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center text-base group-hover:rotate-90 transition-transform duration-300">+</span>
                <span>New Health Analysis</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}
              className={`relative overflow-hidden bg-white/5 border border-white/8 rounded-3xl p-5 hover:bg-white/8 transition group`}
            >
              <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition`} />
              <div className={`w-11 h-11 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center text-xl shadow-lg ${s.glow} mb-4`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-black text-white">{s.val}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Line chart */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 bg-white/5 border border-white/8 rounded-[32px] p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Health Score Trend</h3>
                <p className="text-gray-500 text-xs font-medium">Track improvements over time</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center text-xl">📈</div>
            </div>
            <div className="h-64">
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #ffffff15', borderRadius: 16, color: '#fff', fontSize: 12 }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3}
                      dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#0a0b1e' }}
                      activeDot={{ r: 7, fill: '#60a5fa' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <span className="text-4xl mb-3">📊</span>
                  <p className="font-bold text-sm">No data yet — run your first analysis!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pie chart */}
          <motion.div {...fadeUp(0.25)} className="bg-white/5 border border-white/8 rounded-[32px] p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-white text-lg">Risk Distribution</h3>
                <p className="text-gray-500 text-xs font-medium">Across all assessments</p>
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-xl">🥧</div>
            </div>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #ffffff15', borderRadius: 12, color: '#fff', fontSize: 11 }} />
                    <Legend verticalAlign="bottom" iconType="circle"
                      wrapperStyle={{ fontSize: '10px', fontWeight: '800', paddingTop: '12px', color: '#9ca3af' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <span className="text-4xl mb-3">🎯</span>
                  <p className="font-bold text-sm text-center">No assessments<br/>found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Filter Pills ── */}
        <div className="flex overflow-x-auto pb-3 mb-6 gap-2 scrollbar-hide">
          {filterOptions.map(opt => (
            <button key={opt}
              onClick={() => { setFilter(opt); setPage(1); }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                filter === opt
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt === 'HighRisk' ? '⚠️ High Risk' : opt}
            </button>
          ))}
        </div>

        {/* ── History Table ── */}
        <motion.div {...fadeUp(0.3)} className="bg-white/5 border border-white/8 rounded-[32px] overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Loading records...</p>
            </div>
          ) : data.predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    {['Date', 'Disease', 'Risk %', 'Severity', 'Score', 'Actions'].map(h => (
                      <th key={h} className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.predictions.map((p, idx) => {
                    const sev = p.primaryDisease?.severity || 'Low';
                    const cfg = severityConfig[sev] || severityConfig.Low;
                    const prob = p.primaryDisease?.probability || 0;
                    return (
                      <motion.tr key={p._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                        onClick={() => navigate(`/result/${p._id}`)}
                      >
                        {/* Date */}
                        <td className="px-6 py-5">
                          <span className="block text-sm font-bold text-white">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold">#{p._id.slice(-6).toUpperCase()}</span>
                        </td>
                        {/* Disease */}
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🫀</span>
                            <span className="text-sm font-black text-white">{p.primaryDisease?.name}</span>
                          </div>
                        </td>
                        {/* Risk % */}
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${prob > 60 ? 'bg-red-500' : prob > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(prob, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-black text-white">{prob}%</span>
                          </div>
                        </td>
                        {/* Severity */}
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            <span>{sev}</span>
                          </span>
                        </td>
                        {/* Score */}
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-emerald-400">75/100</span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => navigate(`/result/${p._id}`)}
                              className="w-9 h-9 bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl flex items-center justify-center transition text-base"
                              title="View Report"
                            >👁</button>
                            <button onClick={() => handleDelete(p._id)}
                              className="w-9 h-9 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white rounded-xl flex items-center justify-center transition text-base"
                              title="Delete"
                            >🗑</button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-28 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-5xl">🔬</div>
              <h3 className="text-2xl font-black text-white mb-2">No predictions yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                Upload your medical report or fill in your health details to get your first AI-powered diagnosis.
              </p>
              <Link to="/predict"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition hover:-translate-y-1"
              >
                <span>🚀</span><span>Start First Analysis</span>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="px-6 py-4 bg-white/3 border-t border-white/8 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Page {page} of {data.totalPages} · {data.totalCount} total records
              </p>
              <div className="flex space-x-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition text-sm"
                >‹</button>
                <button disabled={page === data.totalPages} onClick={() => setPage(page + 1)}
                  className="w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition text-sm"
                >›</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
