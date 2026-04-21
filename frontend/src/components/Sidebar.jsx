import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { IoSunnyOutline, IoMoonOutline, IoLogOutOutline } from "react-icons/io5";
import { FiPieChart, FiTrendingUp, FiTrendingDown, FiMessageSquare } from "react-icons/fi";

const Sidebar = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();
  const { theme, setTheme, setIsAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!userData[currentUserEmail]) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  const { name, email, profilePic } = userData[currentUserEmail];

  const handleNavigation = (path) => () => navigate(path);

  const isActive = (path) => currentPath === path;

  const getMenuClasses = (path) => {
    const active = isActive(path);
    return `group flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/25"
        : theme
        ? "text-gray-400 hover:text-white hover:bg-gray-800"
        : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
    }`;
  };

  const getIconClasses = (path) => {
    const active = isActive(path);
    return `text-xl transition-colors duration-300 ${
      active
        ? "text-white"
        : theme
        ? "text-gray-500 group-hover:text-white"
        : "text-gray-400 group-hover:text-indigo-600"
    }`;
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setCurrentUserEmail(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div
      className={`relative p-6 flex flex-col w-full h-full border-r transition-colors duration-300 ${
        theme
          ? "bg-[#0b0f19] border-gray-800 text-white"
          : "bg-gray-50/50 border-gray-200 text-gray-900"
      }`}
    >
      {/* Brand Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex justify-center items-center cursor-pointer mb-10"
      >
        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
          Xpenso.
        </span>
      </div>

      {/* User Info Profile Plate */}
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl mb-8 transition-colors ${
          theme ? "bg-gray-800/50" : "bg-white shadow-sm border border-gray-100"
        }`}
      >
        <img
          src={profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
        />
        <div className="flex flex-col truncate">
          <h2
            className={`text-sm font-semibold truncate ${
              theme ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {name}
          </h2>
          <p
            className={`text-xs truncate ${
              theme ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {email}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 mb-8 flex-grow">
        <button onClick={handleNavigation("/dashboard")} className={getMenuClasses("/dashboard")}>
          <FiPieChart className={getIconClasses("/dashboard")} />
          <span>Dashboard</span>
        </button>
        <button onClick={handleNavigation("/income")} className={getMenuClasses("/income")}>
          <FiTrendingUp className={getIconClasses("/income")} />
          <span>Income</span>
        </button>
        <button onClick={handleNavigation("/expense")} className={getMenuClasses("/expense")}>
          <FiTrendingDown className={getIconClasses("/expense")} />
          <span>Expenses</span>
        </button>
        <button onClick={handleNavigation("/loan")} className={getMenuClasses("/loan")}>
          <FiMessageSquare className={getIconClasses("/loan")} />
          <span>Loans</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 mt-auto pb-4">
        <button
          onClick={() => setTheme(!theme)}
          aria-label="Toggle theme"
          className={`flex items-center gap-3 w-full px-5 py-3 rounded-2xl transition duration-300 font-medium ${
            theme
              ? "text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20"
              : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          }`}
        >
          {theme ? (
            <IoSunnyOutline className="text-xl" />
          ) : (
            <IoMoonOutline className="text-xl" />
          )}
          <span>{theme ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={logoutHandler}
          className={`flex items-center gap-3 w-full px-5 py-3 rounded-2xl transition duration-300 font-medium ${
            theme
              ? "text-rose-400 hover:bg-rose-500/10"
              : "text-rose-600 hover:bg-rose-50"
          }`}
        >
          <IoLogOutOutline className="text-xl" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;