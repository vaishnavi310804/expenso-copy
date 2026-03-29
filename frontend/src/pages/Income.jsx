import React, { useContext } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  Scale,
  scales,
  plugins,
} from "chart.js";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import IncomeSources from "../components/IncomeSources";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale
);

const Income = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();

  if (!userData[currentUserEmail]) {
    return (
      <p className="text-2xl p-6 text-center text-black">
        User data not found.
      </p>
    );
  }

  const { name, balance, income, transactions, profilePic } =
    userData[currentUserEmail];
  const { menu, setMenu } = useContext(UserContext);
  const { theme } = useContext(UserContext);

  const incomeData = transactions.filter((t) => t.amount > 0);

  const grouped = incomeData.reduce((sum, curr) => {
    sum[curr.date] = (sum[curr.date] || 0) + curr.amount;
    return sum;
  }, {});

  const sorted = Object.entries(grouped).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  );

  const labels = sorted.map(([date]) => date);
  const values = sorted.map(([, amount]) => amount);

  const IncomeOverviewData = {
    labels: labels,
    datasets: [
      {
        label: "Income Overview",
        data: values,
        backgroundColor: theme
          ? "rgba(168, 85, 247, 0.6)"
          : "rgba(139, 92, 246, 0.3)",
        borderColor: theme
          ? "rgba(233, 213, 255, 0.8)"
          : "rgba(139, 92, 246, 1)",
        borderRadius: 10,
        hoverBackgroundColor: theme
          ? "rgba(216, 180, 254, 0.9)"
          : "rgba(139, 92, 246, 0.7)",
      },
    ],
  };

  const IncomeOverviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: theme ? "white" : "black",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme ? "white" : "black",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5000,
          color: theme ? "white" : "black",
        },
      },
    },
  };

  const navigate = useNavigate();

  const addIncomeHandler = () => {
    navigate("/form");
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        theme ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <NavbarPages />
      <div className="flex">
        <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 shadow-md bg-white z-40">
          <Sidebar />
        </div>
        <div
          className={`flex-1 p-2 md:ml-56 lg:ml-64 ${
            theme ? "bg-gray-700" : "bg-white"
          } transition-colors duration-300 overflow-y-auto`}
        >
          <div className=" p-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-3xl font-semibold ${
                  theme ? "text-white" : "text-black"
                }`}
              >
                Income Overview
              </h2>
              <button
                onClick={addIncomeHandler}
                className="text-white bg-purple-500 hover:bg-purple-700 font-medium py-2 px-4 rounded-lg transition duration-300 border border-purple-400"
              >
                Add Income
              </button>
            </div>
            <div className="w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
              <Bar data={IncomeOverviewData} options={IncomeOverviewOptions} />
            </div>
          </div>
          <IncomeSources />
        </div>
      </div>
    </div>
  );
};

export default Income;
