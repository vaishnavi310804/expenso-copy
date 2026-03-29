import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data, theme }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No category data available.</p>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.amount),
        backgroundColor: [
          "#8B5CF6", "#F43F5E", "#FACC15", "#38BDF8", "#34D399", "#A78BFA", 
          "#FB923C", "#E879F9", "#4ADE80", "#2DD4BF"
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: theme ? "#D1D5DB" : "#4B5563",
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 15,
          usePointStyle: true,
        },
      },
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
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
