import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data, theme }) => {
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-gray-400">No category map available.</div>;
  }

  // Fintech gradient-like palette (soft & bold colors)
  const colors = [
    "#6366f1", // indigo-500
    "#10b981", // emerald-500
    "#f43f5e", // rose-500
    "#f59e0b", // amber-500
    "#0ea5e9", // sky-500
    "#d946ef", // fuchsia-500
    "#8b5cf6", // violet-500
    "#14b8a6", // teal-500
    "#84cc16", // lime-500
    "#3b82f6"  // blue-500
  ];

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.amount),
        backgroundColor: colors,
        borderColor: theme ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: theme ? "#94a3b8" : "#475569",
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
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
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[280px] sm:h-[320px] flex justify-center items-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
