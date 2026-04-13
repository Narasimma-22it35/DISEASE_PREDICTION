import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiDownload, HiRefresh, HiChartSquareBar, HiCursorClick, HiCheckCircle, 
  HiExclamation, HiLightningBolt, HiExternalLink, HiSearch, HiArrowRight 
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generatePDFReport } from '../components/PDFReport';
import toast from 'react-hot-toast';

// Components
import RiskMeter from '../components/RiskMeter';
import DiseaseCard from '../components/DiseaseCard';
import OvercomeTips from '../components/HealthPlan/OvercomeTips';
import ProsCons from '../components/HealthPlan/ProsCons';
import FoodGuide from '../components/HealthPlan/FoodGuide';
import DosAndDonts from '../components/HealthPlan/DosAndDonts';
import ExerciseVideos from '../components/HealthPlan/ExerciseVideos';
import VoiceAssistant from '../components/VoiceAssistant';
import NearbyDoctors from '../components/NearbyDoctors';

const Result = () => {
  const { predictionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Summary');
  const [showConsult, setShowConsult] = useState(false);

  useEffect(() => {
    const fetchHealthPlan = async () => {
      try {
        const res = await axios.get(`/api/healthplan/${predictionId}`);
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load health plan');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchHealthPlan();
  }, [predictionId, navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
       <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Curating Health Insights...</p>
    </div>
  );

  const { prediction, healthPlan } = data;
  const primaryPrediction = prediction?.results?.[0] || {}; 
  const secondaryPredictions = prediction?.results?.slice(1) || [];

  // Chart Data for Risk Factors
  const chartData = (prediction?.riskFactors || []).slice(0, 5).map(rf => ({
    name: rf?.feature?.split('_').join(' ') || 'Unknown',
    impact: Math.round((rf?.impact || 0) * 100)
  }));

  const tabs = [
    { id: 'Summary', icon: '📊' },
    { id: 'How to Overcome', icon: '💪' },
    { id: 'Pros & Cons', icon: '⚖️' },
    { id: 'Food Guide', icon: '🥗' },
    { id: 'Do\'s & Don\'ts', icon: '✅' },
    { id: 'Exercises', icon: '🏋️' },
    { id: 'Warning Signs', icon: '⚠️' },
    { id: 'Checkup Plan', icon: '📅' }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Nearby Doctors Modal */}
      <NearbyDoctors
        isOpen={showConsult}
        onClose={() => setShowConsult(false)}
        disease={healthPlan?.disease}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Global Health Report</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{prediction?.createdAt ? new Date(prediction.createdAt).toLocaleDateString() : 'Today'}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Health Assessment: <span className="text-blue-600">{prediction?.patientId?.personalInfo?.name || 'Patient'}</span>
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-bold border border-gray-100">{prediction?.patientId?.personalInfo?.age || '?'} Years</span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-bold border border-gray-100 capitalize">{prediction?.patientId?.personalInfo?.gender || 'Unknown'}</span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-bold border border-gray-100">ID: #{prediction?._id?.slice(-6)?.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
               <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(75)}`}>
                  <span className="text-3xl font-black leading-none">75</span>
                  <span className="text-[8px] font-black uppercase tracking-widest">Score</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Banner */}
      {primaryPrediction?.confidence > 80 && (
        <div className="bg-red-600 text-white py-4 px-4 sticky top-16 z-30 shadow-2xl">
           <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <HiExclamation className="w-6 h-6 animate-pulse" />
                 <span className="text-sm font-black uppercase tracking-widest">Urgent Medical Attention Recommended: {primaryPrediction?.disease} Detected</span>
              </div>
              <button className="hidden sm:block text-xs font-black uppercase border border-white/50 px-4 py-2 rounded-full hover:bg-white hover:text-red-600 transition">Contact Specialist</button>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Result Detail */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[40px] shadow-xl shadow-blue-50/50 border border-gray-100">
               <div className="flex flex-col md:flex-row gap-10">
                  <div className="md:w-1/2 space-y-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-14 h-14 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-red-50">
                          {primaryPrediction.disease === 'Diabetes' ? '🩸' : '❤️'}
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-gray-900">{primaryPrediction.disease}</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Health Concern</p>
                       </div>
                    </div>
                    <RiskMeter 
                      percentage={primaryPrediction.probability} 
                      level={healthPlan.riskLevel} 
                      size="md"
                    />
                    <div className="flex space-x-3">
                       <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
                          <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Confidence</span>
                          <span className="text-xl font-black text-blue-600">{primaryPrediction.confidence}%</span>
                       </div>
                       <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
                          <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Reasoning</span>
                          <span className="text-xs font-bold text-gray-900 capitalize">Hybrid AI/ML</span>
                       </div>
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Top Contributing Risk Factors</h3>
                    <div className="h-[250px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                             <Bar dataKey="impact" radius={[0, 10, 10, 0]}>
                                {chartData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>
               </div>
            </section>

            {/* Other Diseases */}
            <section>
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Secondary Screening Observations</h3>
               <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide">
                  {secondaryPredictions.map((dp, i) => (
                    <DiseaseCard 
                      key={i} 
                      disease={dp.disease} 
                      riskPercentage={dp.probability} 
                      severity={dp.probability > 40 ? 'HIGH' : 'LOW'}
                      reason="Standard screening analysis"
                    />
                  ))}
               </div>
            </section>
          </div>

          {/* Specialist & Info Column */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition">
                   <HiLightningBolt className="w-20 h-20 text-white/5" />
                </div>
                <h3 className="text-xl font-black mb-6 relative z-10">Medical Action Required</h3>
                <div className="space-y-4 relative z-10">
                   <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">🩺</div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase">Consult Specialist</p>
                        <p className="font-bold text-sm">Consult a {healthPlan.severity === 'Critical' ? 'Urgent Care' : 'General Physician'} immediately.</p>
                      </div>
                   </div>
                   <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">📑</div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase">Recommended Tests</p>
                        <p className="font-bold text-sm">Follow-up with CBC, Lipid Profile, and HbA1c tests.</p>
                      </div>
                   </div>
                </div>
                 <button
                   onClick={() => setShowConsult(true)}
                   className="w-full mt-8 py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 flex items-center justify-center space-x-2"
                 >
                   <span>🏥</span><span>Book Consult Now</span>
                 </button>
             </div>

             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-50/50">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Urgent Warning Signs</h3>
                <div className="space-y-4">
                   {(healthPlan?.plan?.warning_signs || []).slice(0, 3).map((sign, i) => (
                     <div key={i} className="flex flex-col p-4 bg-red-50 rounded-2xl border border-red-100">
                        <span className="text-xs font-black text-red-900 mb-1">{sign?.sign}</span>
                        <span className="text-[10px] text-red-600 font-bold">{sign?.urgency} Action Required</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Voice Assistant - Accessible health report reading */}
        <div className="mt-10 max-w-7xl mx-auto px-4">
          <VoiceAssistant prediction={prediction} healthPlan={healthPlan} />
        </div>

        {/* Tab Navigation */}
        <div className="mt-16 sticky top-[138px] z-20 overflow-x-auto bg-gray-50/80 backdrop-blur pb-4 pt-4 -mx-4 px-4 flex space-x-2 scrollbar-hide">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-black transition-all whitespace-nowrap shadow-sm border ${
                 activeTab === tab.id 
                  ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-xl shadow-blue-100' 
                  : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600 hover:border-gray-200'
               }`}
             >
               <span>{tab.icon}</span>
               <span className="uppercase tracking-widest text-[10px]">{tab.id}</span>
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="mt-10 min-h-[600px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-white/40 backdrop-blur rounded-[50px] p-8 md:p-12 border border-white/60 shadow-inner"
             >
                {activeTab === 'Summary' && (
                  <div className="space-y-12">
                     <div className="max-w-4xl">
                        <h2 className="text-4xl font-black text-gray-900 mb-6">Patient Health Summary</h2>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                           The AI Engine has concluded a {healthPlan.riskLevel} risk assessment for {healthPlan.disease}. 
                           Multiple clinical indicators including {chartData.slice(0, 3).map(c => c.name).join(', ')} suggest focused intervention is necessary.
                        </p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                           <span className="text-4xl block mb-2">🩸</span>
                           <h4 className="text-xs font-black text-gray-400 uppercase mb-4">Primary Risk</h4>
                           <span className="text-xl font-black text-gray-900">{healthPlan.disease}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                           <span className="text-4xl block mb-2">⚖️</span>
                           <h4 className="text-xs font-black text-gray-400 uppercase mb-4">Risk Level</h4>
                           <span className="text-xl font-black text-red-600 uppercase italic">{healthPlan.riskLevel}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                           <span className="text-4xl block mb-2">⚕️</span>
                           <h4 className="text-xs font-black text-gray-400 uppercase mb-4">Severity</h4>
                           <span className="text-xl font-black text-orange-600 uppercase italic">{healthPlan.severity}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                           <span className="text-4xl block mb-2">📅</span>
                           <h4 className="text-xs font-black text-gray-400 uppercase mb-4">Last Modified</h4>
                           <span className="text-xl font-black text-gray-900">Today</span>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'How to Overcome' && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 mb-8">Clinical Interventions</h2>
                      <OvercomeTips tips={healthPlan.plan.overcome_tips} />
                   </div>
                )}

                {activeTab === 'Pros & Cons' && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 mb-8">Risk/Benefit Analysis</h2>
                      <ProsCons 
                        pros={healthPlan.plan.pros_of_early_detection} 
                        cons={healthPlan.plan.cons_of_ignoring} 
                      />
                   </div>
                )}

                {activeTab === 'Food Guide' && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 mb-8">Nutritional Recovery Plan</h2>
                      <FoodGuide 
                        foods={healthPlan.plan.recommended_foods} 
                        fruits={healthPlan.plan.recommended_fruits}
                        vegetables={healthPlan.plan.recommended_vegetables}
                        avoid={healthPlan.plan.foods_to_avoid}
                      />
                   </div>
                )}

                {activeTab === 'Do\'s & Don\'ts' && (
                  <div className="space-y-8">
                     <h2 className="text-4xl font-black text-gray-900 mb-8">Lifestyle Habit Core</h2>
                     <DosAndDonts 
                       dos={healthPlan.plan.dos} 
                       donts={healthPlan.plan.donts} 
                     />
                  </div>
                )}

                {activeTab === 'Exercises' && (
                   <div className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-4xl font-black text-gray-900">Workout & Recovery</h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">6 Guided Tutorials Found</span>
                      </div>
                      <ExerciseVideos exercises={healthPlan.exercisesWithVideos} />
                   </div>
                )}

                {activeTab === 'Warning Signs' && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 mb-8">Critical Alert Markers</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {healthPlan.plan.warning_signs.map((sign, i) => (
                           <div key={i} className="p-8 bg-red-50/50 border border-red-100 rounded-3xl flex flex-col group hover:bg-red-50 transition">
                              <div className="flex items-center justify-between mb-4">
                                 <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">⚠️</span>
                                 <span className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-full">{sign.urgency}</span>
                              </div>
                              <h3 className="text-xl font-black text-red-900 mb-2">{sign.sign}</h3>
                              <p className="text-sm text-red-700 font-bold mb-4 uppercase tracking-tighter">What it means: <span className="text-red-500">{sign.meaning}</span></p>
                              <div className="mt-auto pt-6 border-t border-red-100 flex items-center space-x-3 text-red-900 font-black text-sm">
                                 <HiArrowRight className="w-5 h-5" />
                                 <span>Action: {sign.what_to_do}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                )}

                {activeTab === 'Checkup Plan' && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 mb-8">Long-term Monitoring</h2>
                      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Test Procedure</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Frequency</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Objective / Reasoning</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Normal Range</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {(healthPlan?.plan?.monthly_checkups || []).map((test, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition duration-300">
                                   <td className="px-8 py-6 font-black text-gray-900 text-sm">{test?.test}</td>
                                   <td className="px-8 py-6">
                                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">{test?.frequency}</span>
                                   </td>
                                   <td className="px-8 py-6 text-sm text-gray-500 font-medium leading-relaxed max-w-[300px]">{test?.why}</td>
                                   <td className="px-8 py-6 text-xs font-black text-gray-400 italic">{test?.normal_range}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4">
           <button 
             onClick={() => {
               toast.loading('Generating Clinical PDF Report...', { id: 'pdf-gen' });
               setTimeout(() => {
                 generatePDFReport(prediction, healthPlan);
                 toast.success('Report Downloaded Successfully!', { id: 'pdf-gen' });
               }, 1000);
             }}
             className="flex items-center space-x-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition transform hover:-translate-y-1 active:scale-95"
           >
              <HiDownload className="w-5 h-5" />
              <span>Download PDF Health Passport</span>
           </button>
           <button 
             onClick={() => navigate('/predict')}
             className="flex items-center space-x-3 bg-white text-gray-900 border border-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 active:scale-95"
           >
              <HiRefresh className="w-5 h-5" />
              <span>Perform New Assessment</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
