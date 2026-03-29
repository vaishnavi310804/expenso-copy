import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrendsChart = ({ data, theme, view, setView }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No trend data available.</p>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Expenses',
        data: data.map(d => d.expense),
        backgroundColor: theme ? "rgba(167, 139, 250, 0.8)" : "rgba(139, 92, 246, 0.8)",
        borderRadius: 6,
        hoverBackgroundColor: theme ? "rgba(167, 139, 250, 1)" : "rgba(139, 92, 246, 1)",
      },
    ],
  };

  const options = {
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: theme ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme ? '#fff' : '#000',
        bodyColor: theme ? '#ccc' : '#444',
        borderColor: theme ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: theme ? '#9CA3AF' : '#4B5563', family: "'Inter', sans-serif" }
      },
      x: {
        grid: { display: false },
        ticks: { color: theme ? '#9CA3AF' : '#4B5563', family: "'Inter', sans-serif" }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Spending Trends</h3>
        <div className={`flex rounded-lg p-1 ${theme ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <button 
            onClick={() => setView('weekly')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              view === 'weekly' 
                ? (theme ? 'bg-gray-700 shadow-sm text-purple-400' : 'bg-white shadow-sm text-purple-600') 
                : (theme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              view === 'monthly' 
                ? (theme ? 'bg-gray-700 shadow-sm text-purple-400' : 'bg-white shadow-sm text-purple-600') 
                : (theme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
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
