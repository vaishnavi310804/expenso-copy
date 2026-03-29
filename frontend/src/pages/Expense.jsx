import React, { useContext } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler
);

const Expense = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();
  const { theme, setTheme, menu, setMenu } = useContext(UserContext);
  const navigate = useNavigate();

  if (!userData[currentUserEmail]) {
    return (
      <p className="text-2xl p-6 text-center text-black">
        User data not found.
      </p>
    );
  }

  const { name, balance, expenses, transactions, profilePic } =
    userData[currentUserEmail];
  const expenseData = transactions.filter((t) => t.amount < 0);

  const grouped = expenseData.reduce((sum, curr) => {
    if (!sum[curr.date]) {
      sum[curr.date] = { amount: 0, labels: new Set() };
    }
    sum[curr.date].amount += Math.abs(curr.amount);
    sum[curr.date].labels.add(curr.label);
    return sum;
  }, {});

  const labels = Object.keys(grouped);
  const values = labels.map((date) => grouped[date].amount);
  const labelsMap = labels.map((date) =>
    Array.from(grouped[date].labels).join(", ")
  );

  const ExpenseOverviewData = {
    labels: labels,
    datasets: [
      {
        label: "Expense Overview",
        data: values,
        backgroundColor: theme
          ? "rgba(147, 51, 234, 0.2)"
          : "rgba(168, 85, 247, 0.1)",
        borderColor: "#9333EA",
        pointBackgroundColor: "#9333EA",
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
        labels: {
          color: theme ? "white" : "black",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const multiLabel = labelsMap[index];
            const amount = context.formattedValue;
            return [`Total: ₹${amount}`, `Details: ${multiLabel}`];
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme ? "#e0d7ff" : "#333333",
        },
        grid: {
          color: theme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          color: theme ? "#e0d7ff" : "#333333",
        },
        grid: {
          color: theme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };


  const addExpenseHandler = () => {
    navigate("/expenseform");
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        theme ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <NavbarPages/>

      <div className="flex">
        <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 shadow-md bg-white z-40">
          <Sidebar />
        </div>
        <div
          className={`flex-1 p-2 md:ml-56 lg:ml-64 ${
            theme ? "bg-gray-800" : "bg-gray-100"
          } overflow-y-auto`}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-3xl font-semibold ${
                  theme ? "text-white" : "text-black"
                }`}
              >
                Expense Overview
              </h2>
              <button
                onClick={addExpenseHandler}
                className="text-white bg-purple-500 hover:bg-purple-700 font-medium py-2 px-4 rounded-lg transition"
              >
                Add Expense
              </button>
            </div>
            <div className="w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
              <Line
                data={ExpenseOverviewData}
                options={ExpenseOverviewOptions}
              />
            </div>
          </div>
          <ExpenseSources />
        </div>
      </div>
    </div>
  );
};

export default Expense;
