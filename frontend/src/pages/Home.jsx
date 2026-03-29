import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { FaWallet, FaChartPie, FaMoneyBillWave } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  const registerUser = () => {
    navigate("/register");
  };

  const LogoutUser = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Successfully Logged Out", { autoClose: 1000 });
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme ? "bg-gray-800" : "bg-purple-100"
      }`}
    >
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide mb-6 ${
              theme ? "text-purple-200" : "text-purple-800"
            }`}
          >
            <span className="inline-flex flex-wrap justify-center items-center gap-3">
              <FaWallet
                className={`text-3xl sm:text-4xl ${
                  theme ? "text-purple-200" : "text-purple-600"
                }`}
              />
              Welcome to Xpenso
              <FaChartPie
                className={`text-3xl sm:text-4xl ${
                  theme ? "text-purple-200" : "text-purple-600"
                }`}
              />
            </span>
          </h1>

          <p
            className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-2 ${
              theme ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Track your income, expenses, and savings – all in one place.
          </p>
          <p
            className={`text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto mb-8 ${
              theme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Make smarter financial decisions with real-time insights.
          </p>

          <div
            className={`flex  sm:flex-row justify-center items-center gap-6 mt-6 text-3xl ${
              theme ? "text-purple-200" : "text-purple-600"
            }`}
          >
            {[FaMoneyBillWave, FaChartPie, FaWallet].map((Icon, idx) => (
              <Icon
                key={idx}
                className="hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={isAuthenticated ? LogoutUser : registerUser}
              className={`py-2 px-6 text-sm sm:text-base rounded-lg shadow-md transition duration-300 flex items-center font-medium gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                theme
                  ? "bg-purple-700 hover:bg-purple-600 text-white focus:ring-purple-500"
                  : "bg-purple-800 hover:bg-purple-700 text-white focus:ring-purple-400"
              }`}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
