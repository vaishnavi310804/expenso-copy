import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrendsChart = ({ data, theme, view, setView }) => {
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-gray-400">No trend data available.</div>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Expenses',
        data: data.map(d => d.expense),
        backgroundColor: theme ? "rgba(99, 102, 241, 0.8)" : "rgba(79, 70, 229, 0.8)", // indigo-500/600
        borderRadius: 8,
        hoverBackgroundColor: theme ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
      },
    ],
  };

  const options = {
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: theme ? '#1e293b' : '#ffffff',
        titleColor: theme ? '#f8fafc' : '#0f172a',
        bodyColor: theme ? '#cbd5e1' : '#475569',
        bodyFont: { weight: 'bold', size: 14 },
        borderColor: theme ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => `  ₹${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: theme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderDash: [5, 5] },
        ticks: { color: theme ? '#64748b' : '#94a3b8', family: "'Inter', sans-serif" },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: theme ? '#64748b' : '#94a3b8', family: "'Inter', sans-serif" },
        border: { display: false }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-end items-center mb-6">
        <div className={`flex rounded-xl p-1.5 transition-colors ${theme ? 'bg-[#1e293b]' : 'bg-gray-100'}`}>
          <button 
            onClick={() => setView('weekly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              view === 'weekly' 
                ? (theme ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-indigo-600 shadow-sm') 
                : (theme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              view === 'monthly' 
                ? (theme ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-indigo-600 shadow-sm') 
                : (theme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[250px] w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrendsChart;
