import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { FiPieChart, FiTrendingUp, FiShield } from "react-icons/fi";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, theme } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const LogoutUser = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Successfully logged out", { autoClose: 1000 });
    navigate("/");
  };

  const featureCards = [
    {
      icon: <FiPieChart className="text-3xl text-indigo-500" />,
      title: "Smart Analytics",
      desc: "Visualize your financial habits with rich interactive charts."
    },
    {
      icon: <FiTrendingUp className="text-3xl text-emerald-500" />,
      title: "Track Growth",
      desc: "Monitor your income and expenses effortlessly over time."
    },
    {
      icon: <FiShield className="text-3xl text-blue-500" />,
      title: "Secure & Private",
      desc: "Your data is encrypted and securely stored."
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center -mt-10 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        {theme ? (
          <>
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          </>
        ) : null}

        <div className="w-full max-w-5xl text-center z-10">
          
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm font-medium bg-white/50 border-indigo-100 text-indigo-600 dark:bg-gray-800/50 dark:border-gray-700 dark:text-indigo-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Your Personal Finance Copilot
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight`}>
            Master your money with <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
              Complete Clarity.
            </span>
          </h1>

          <p className={`text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed font-light ${theme ? "text-gray-400" : "text-gray-600"}`}>
            Track your income, expenses, and savings seamlessly in one beautiful dashboard designed for modern wealth building.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <button
              onClick={handleCTA}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] transition-all duration-300 hover:-translate-y-1"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              <FaArrowRight className="text-sm" />
            </button>
            
            {isAuthenticated && (
              <button
                onClick={LogoutUser}
                className={`w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${theme ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
              >
                Log out
              </button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {featureCards.map((card, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center p-6 rounded-3xl border transition-colors duration-300 ${theme ? "bg-[#0f172a]/50 border-gray-800 backdrop-blur-sm hover:bg-[#0f172a]" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}`}>
                <div className={`p-4 rounded-2xl mb-4 ${theme ? "bg-gray-800/80" : "bg-indigo-50"}`}>
                  {card.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${theme ? "text-gray-100" : "text-gray-900"}`}>{card.title}</h3>
                <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
