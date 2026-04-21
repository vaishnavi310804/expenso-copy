import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale
} from "chart.js";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import IncomeSources from "../components/IncomeSources";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";
import { FiPlus } from "react-icons/fi";

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale
);

const Income = () => {
  const { userData, currentUserEmail } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  if (!userData[currentUserEmail]) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
        <p className="font-medium animate-pulse text-gray-500">Loading Income Data...</p>
      </div>
    );
  }

  const { transactions } = userData[currentUserEmail];
  const incomeData = transactions.filter((t) => t.amount > 0);

  const grouped = incomeData.reduce((sum, curr) => {
    const dateStr = new Date(curr.date).toISOString().split('T')[0];
    sum[dateStr] = (sum[dateStr] || 0) + curr.amount;
    return sum;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a,b) => new Date(a) - new Date(b));
  
  const labels = sortedDates;
  const values = sortedDates.map((date) => grouped[date]);

  const IncomeOverviewData = {
    labels: labels.map(d => new Date(d).toLocaleDateString(undefined, {month:'short', day:'numeric'})),
    datasets: [
      {
        label: "Income Over Time",
        data: values,
        backgroundColor: theme
          ? "rgba(16, 185, 129, 0.2)" // emerald-500
          : "rgba(16, 185, 129, 0.15)",
        borderColor: "#10b981", 
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: theme
          ? "rgba(16, 185, 129, 0.4)"
          : "rgba(16, 185, 129, 0.3)",
      },
    ],
  };

  const IncomeOverviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme ? "#1e293b" : "#fff",
        titleColor: theme ? "#cbd5e1" : "#64748b",
        bodyColor: theme ? "#fff" : "#0f172a",
        bodyFont: { weight: 'bold', size: 14 },
        borderColor: theme ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const amount = context.formattedValue;
            return `Income: +₹${amount}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme ? "#64748b" : "#94a3b8", font: {family: 'Inter'} },
        grid: { display: false },
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5000,
          color: theme ? "#64748b" : "#94a3b8",
          font: {family: 'Inter'},
          callback: (value) => `₹${value}`
        },
        grid: {
          color: theme ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)",
          borderDash: [5, 5]
        },
        border: { display: false }
      },
    },
  };

  const addIncomeHandler = () => {
    navigate("/incomeform");
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
      <NavbarPages />

      <div className="flex flex-1">
        <div className="hidden md:block w-64 flex-shrink-0 z-40">
          <div className="fixed top-0 left-0 w-64 h-screen">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          <div className="flex justify-between items-center pb-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Income</h1>
              <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>Monitor your earnings.</p>
            </div>
            <button
              onClick={addIncomeHandler}
              className="flex items-center gap-2 text-white bg-emerald-500 hover:bg-emerald-600 font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
            >
              <FiPlus className="text-lg"/> <span className="hidden sm:inline">Add Income</span>
            </button>
          </div>

          {/* Chart Container */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
             <h3 className="text-lg font-bold mb-6 tracking-tight">Earning Timeline</h3>
             <div className="w-full h-[300px] sm:h-[400px]">
                {values.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Not enough data to map trends.</div>
                ) : (
                  <Bar data={IncomeOverviewData} options={IncomeOverviewOptions} />
                )}
             </div>
          </div>
          
          {/* List Component wrapper */}
          <div className={`rounded-3xl border overflow-hidden ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
            <IncomeSources />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Income;
