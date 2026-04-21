import React from 'react';
import { IoBulbOutline, IoTrendingDownOutline, IoTrendingUpOutline, IoWarningOutline } from 'react-icons/io5';
import { FiCpu } from 'react-icons/fi';

const InsightsList = ({ insights, predictedExpense, theme }) => {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border h-full flex flex-col transition-all duration-300 ${theme ? 'bg-[#0f172a] border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/40'}`}>
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${theme ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <IoBulbOutline size={24} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">Smart Insights</h3>
      </div>
      
      {/* AI Prediction Box */}
      <div className={`relative overflow-hidden mb-8 p-6 rounded-2xl border transition-all duration-300 ${theme ? 'bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-blue-50/50 border-indigo-100'}`}>
        <div className="absolute -right-4 -top-4 opacity-10">
          <FiCpu size={100} />
        </div>
        <div className="relative z-10">
          <div className={`flex items-center gap-2 mb-2 text-sm font-semibold tracking-wide uppercase ${theme ? 'text-indigo-400' : 'text-indigo-600'}`}>
            <FiCpu /> AI Prediction Model
          </div>
          <p className={`text-3xl font-extrabold mb-1 tracking-tight ${theme ? 'text-white' : 'text-gray-900'}`}>
            ₹{predictedExpense.toLocaleString()}
          </p>
          <p className={`text-sm font-medium ${theme ? 'text-indigo-300/80' : 'text-indigo-600/80'}`}>
            Expected expense mapping for next month
          </p>
        </div>
      </div>

      <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme ? 'text-gray-500' : 'text-gray-400'}`}>Recent Observations</h4>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {insights.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            Not enough data to map patterns yet. Keep adding transactions!
          </div>
        ) : (
          insights.map((msg, i) => {
            let colorClass = '';
            let Icon = IoBulbOutline;
            
            if (msg.includes('less on')) {
              colorClass = theme 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-100';
              Icon = IoTrendingDownOutline;
            } else if (msg.includes('more on') || msg.includes('Warning')) {
              colorClass = theme 
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                : 'text-rose-700 bg-rose-50 border-rose-100';
              Icon = msg.includes('Warning') ? IoWarningOutline : IoTrendingUpOutline;
            } else {
              colorClass = theme 
                ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
                : 'text-indigo-700 bg-indigo-50 border-indigo-100';
            }

            return (
              <div key={i} className={`p-4 border rounded-2xl flex gap-4 items-start transition-all hover:-translate-y-0.5 ${colorClass}`}>
                <div className="mt-0.5"><Icon size={20} /></div>
                <p className="text-sm font-medium leading-relaxed">{msg}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InsightsList;
