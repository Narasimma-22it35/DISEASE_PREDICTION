import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCloudUpload, HiDocumentText, HiCheckCircle, HiArrowSmRight, HiRefresh, HiCheck, HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ReportUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    setExtractedData(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false
  });

  const handleReadReport = async () => {
    if (!file) return toast.error('Please select a file first.');

    setIsReading(true);
    const formData = new FormData();
    formData.append('report', file);

    try {
      const res = await axios.post('/api/upload/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(res.data);
      toast.success('AI Finished reading!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to read report.');
    } finally {
      setIsReading(false);
    }
  };

  const handleContinue = () => {
    navigate('/predict/form', { state: { extractedData, method: 'upload' } });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest mb-6">
             <HiOutlineSparkles />
             <span>AI Report Reader</span>
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Give us your report 📄</h1>
          <p className="text-xl text-slate-500 font-medium">Our AI Doctor will read your paper and find all your health levels automagically.</p>
        </div>

        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`relative group cursor-pointer bg-white rounded-[50px] border-4 border-dashed px-10 py-24 text-center transition-all duration-500 shadow-2xl shadow-slate-200/50 ${
            isDragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {file ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-6">
                <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[40px] flex items-center justify-center mx-auto shadow-xl">
                  <HiDocumentText className="w-16 h-16" />
                </div>
                <div>
                   <p className="text-2xl font-black text-slate-900 truncate max-w-sm mx-auto">{file.name}</p>
                   <p className="text-sm text-slate-400 mt-2 font-black uppercase tracking-widest bg-slate-100 inline-block px-4 py-1 rounded-full">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                   </p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <div className="w-32 h-32 bg-indigo-100 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <HiCloudUpload className="w-16 h-16" />
                </div>
                <div>
                   <p className="text-2xl font-black text-slate-900">Drop your report here</p>
                   <p className="text-lg text-slate-400 font-medium mt-2">or tap to find it on your phone/computer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleReadReport}
            disabled={!file || isReading}
            className={`h-20 px-16 bg-indigo-600 text-white rounded-[30px] font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center space-x-4`}
          >
            {isReading ? (
              <>
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI Doctor is reading...</span>
              </>
            ) : (
              <>
                <HiCheckCircle className="w-8 h-8" />
                <span>Read My Report</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted Data Preview */}
        <AnimatePresence>
          {extractedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-20 glass-card rounded-[50px] p-10 md:p-16 border-2 border-emerald-100"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">What the AI found</h2>
                   <p className="text-lg text-slate-500 font-medium mt-2">We found these values in your report. Do they look right?</p>
                </div>
                <div className="flex space-x-3">
                   <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
                     <HiCheck /> <span>Checked</span>
                   </div>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[40px] border-2 border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100 text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Test</th>
                      <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(extractedData.extracted_values || {}).map(([key, val], idx) => (
                      val !== null && (
                        <tr key={idx} className="hover:bg-white transition-all">
                          <td className="px-10 py-6 text-lg font-bold text-slate-700 capitalize">
                            {key.split('_').join(' ')}
                          </td>
                          <td className="px-10 py-6 text-right">
                            <span className="text-2xl font-black text-indigo-600">{val}</span>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
                <button 
                  onClick={() => setExtractedData(null)}
                  className="flex items-center space-x-3 text-slate-400 hover:text-rose-600 font-black text-lg transition-all"
                >
                  <HiRefresh className="w-6 h-6" />
                  <span>Try another file</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="h-20 px-16 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-[30px] font-black text-2xl shadow-2xl shadow-emerald-100 hover:scale-105 transition active:scale-95 flex items-center space-x-4"
                >
                  <span>Everything is correct</span>
                  <HiArrowSmRight className="w-8 h-8" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportUpload;
