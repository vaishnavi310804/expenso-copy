import React from 'react';
import { IoBulbOutline, IoTrendingDownOutline, IoTrendingUpOutline, IoWarningOutline } from 'react-icons/io5';

const InsightsList = ({ insights, predictedExpense, theme }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-xl border transition-all h-full ${theme ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-50'}`}>
      <div className="flex items-center gap-2 mb-6 text-purple-600 dark:text-purple-400">
        <IoBulbOutline size={26} />
        <h3 className="text-xl font-bold tracking-tight">Smart Insights</h3>
      </div>
      
      <div className={`mb-6 p-4 rounded-xl border ${theme ? 'bg-indigo-900/20 border-indigo-700/30' : 'bg-indigo-50 border-indigo-200'}`}>
        <p className={`text-sm font-semibold mb-1 ${theme ? 'text-gray-400' : 'text-gray-600'}`}>AI Prediction (Based on last 3 months)</p>
        <p className={`text-2xl font-bold ${theme ? 'text-indigo-300' : 'text-indigo-700'}`}>
          ₹{predictedExpense.toLocaleString()} <span className={`text-sm font-medium ${theme ? 'text-gray-500' : 'text-gray-600'}`}>Expected Expense Next Month</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
        {insights.length === 0 ? (
          <p className="text-gray-500 text-sm">Not enough data to generate insights yet. Keep adding transactions!</p>
        ) : (
          insights.map((msg, i) => {
            let colorClass = '';
            let Icon = IoBulbOutline;
            
            if (msg.includes('less on')) {
              colorClass = theme 
                ? 'text-emerald-300 bg-emerald-900/20 border-emerald-800' 
                : 'text-emerald-800 bg-emerald-50 border-emerald-200';
              Icon = IoTrendingDownOutline;
            } else if (msg.includes('more on') || msg.includes('Warning')) {
              colorClass = theme 
                ? 'text-rose-300 bg-rose-900/20 border-rose-800' 
                : 'text-rose-800 bg-rose-50 border-rose-200';
              Icon = msg.includes('Warning') ? IoWarningOutline : IoTrendingUpOutline;
            } else {
              colorClass = theme 
                ? 'text-blue-300 bg-blue-900/20 border-blue-800' 
                : 'text-blue-800 bg-blue-50 border-blue-200';
            }

            return (
              <div key={i} className={`p-4 border rounded-xl flex gap-3 items-start ${colorClass}`}>
                <div className="mt-0.5"><Icon size={18} /></div>
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
