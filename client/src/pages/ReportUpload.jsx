import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCloudUpload, HiDocumentText, HiCheckCircle, HiArrowSmRight, HiRefresh, HiCheck } from 'react-icons/hi';
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
      'image/png': ['.png']
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
      toast.success('Report analyzed successfully!');
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Upload Medical Report</h1>
          <p className="text-gray-500">AI will read and extract all clinical values automatically.</p>
        </div>

        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`relative group cursor-pointer bg-white rounded-3xl border-3 border-dashed px-8 py-16 text-center transition-all ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <HiDocumentText className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-lg font-bold text-gray-900 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                  <HiCloudUpload className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-gray-900">Drag & drop your report here</p>
                <p className="text-sm text-gray-500">or click to browse from your device</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleReadReport}
            disabled={!file || isReading}
            className={`flex items-center space-x-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:translate-y-0`}
          >
            {isReading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is reading...</span>
              </>
            ) : (
              <>
                <HiCheckCircle className="w-6 h-6" />
                <span>Read Report</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted Data Preview */}
        <AnimatePresence>
          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Extracted Lab Values</h2>
                <div className="flex space-x-2">
                   <div className="flex items-center space-x-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase">
                     <HiCheck className="w-3 h-3" /> <span>Normal</span>
                   </div>
                   <div className="flex items-center space-x-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase">
                     <span>Abnormal</span>
                   </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Test Parameter</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Detected Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(extractedData.extracted_values || {}).map(([key, val], idx) => (
                      val !== null && (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700 capitalize">
                            {key.split('_').join(' ')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-gray-900">{val}</span>
                            {/* Placeholder for range check logic would go here */}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setExtractedData(null)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 font-bold transition"
                >
                  <HiRefresh className="w-5 h-5" />
                  <span>Re-upload Report</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:scale-105 transition active:scale-95 w-full sm:w-auto justify-center"
                >
                  <span>Looks Correct, Continue</span>
                  <HiArrowSmRight className="w-6 h-6" />
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
