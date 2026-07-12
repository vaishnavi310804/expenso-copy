import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import ExpenseSources from "../components/ExpenseSources";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";
import { FiPlus } from "react-icons/fi";

ChartJS.register(
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler
);

const Expense = () => {
  const { userData, currentUserEmail } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  if (!userData[currentUserEmail]) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
        <p className="font-medium animate-pulse text-gray-500">Loading Expense Data...</p>
      </div>
    );
  }

  const { transactions } = userData[currentUserEmail];
  const expenseData = transactions.filter((t) => t.amount < 0);

  const grouped = expenseData.reduce((sum, curr) => {
    // using ISO string up to date part for grouping
    const dateStr = new Date(curr.date).toISOString().split('T')[0];
    if (!sum[dateStr]) {
      sum[dateStr] = { amount: 0, labels: new Set() };
    }
    sum[dateStr].amount += Math.abs(curr.amount);
    sum[dateStr].labels.add(curr.label);
    return sum;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(grouped).sort((a,b) => new Date(a) - new Date(b));
  
  const labels = sortedDates;
  const values = sortedDates.map((date) => grouped[date].amount);
  const labelsMap = sortedDates.map((date) =>
    Array.from(grouped[date].labels).join(", ")
  );

  const ExpenseOverviewData = {
    labels: labels.map(d => new Date(d).toLocaleDateString(undefined, {month:'short', day:'numeric'})),
    datasets: [
      {
        label: "Expense Overview",
        data: values,
        backgroundColor: theme
          ? "rgba(244, 63, 94, 0.15)" // rose-500 opacity
          : "rgba(244, 63, 94, 0.1)",
        borderColor: "#f43f5e", // rose-500
        pointBackgroundColor: "#f43f5e",
        pointBorderColor: theme ? "#0f172a" : "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ExpenseOverviewOptions = {
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
          title: function(context) {
            const index = context[0].dataIndex;
            return labelsMap[index];
          },
          label: function (context) {
            const amount = context.formattedValue;
            return `Total: ₹${amount}`;
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
          stepSize: 1000,
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

  const addExpenseHandler = () => {
    navigate("/expenseform");
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
              <h1 className="text-2xl font-bold tracking-tight mb-1">Expenses</h1>
              <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>Analyze where your money is going.</p>
            </div>
            <button
              onClick={addExpenseHandler}
              className="flex items-center gap-2 text-white bg-rose-500 hover:bg-rose-600 font-medium py-2.5 px-5 rounded-xl shadow-sm shadow-rose-500/30 transition-all hover:-translate-y-0.5"
            >
              <FiPlus className="text-lg"/> <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>


          <div className={`p-6 sm:p-8 rounded-3xl border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
             <h3 className="text-lg font-bold mb-6 tracking-tight">Spending Timeline</h3>
             <div className="w-full h-[300px] sm:h-[400px]">
                {values.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Not enough data to map trends.</div>
                ) : (
                  <Line data={ExpenseOverviewData} options={ExpenseOverviewOptions} />
                )}
             </div>
          </div>
          
          <div className={`rounded-3xl border overflow-hidden ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
            <ExpenseSources />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Expense;
