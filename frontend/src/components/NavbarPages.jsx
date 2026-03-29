import { IoMenu, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const NavbarPages = () => {

    const { userData, currentUserEmail, setCurrentUserEmail } = useData();
      const { menu, setMenu, theme, setTheme, setIsAuthenticated } = useContext(UserContext);
 const { name, transactions, profilePic } = userData[currentUserEmail];
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
 const handleNavigation = (path) => () => navigate(path);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setCurrentUserEmail(null);
    setIsAuthenticated(false);
    navigate("/login");
  };
 const isActive = (path) =>
    `text-left px-4 py-2 hover:bg-purple-100 ${
      currentPath === path
        ? "bg-purple-600 text-white shadow-md"
        : theme
        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
        : "bg-white text-gray-800 hover:bg-gray-300"
    }`;
  
  return (
    <div
        className={`md:hidden flex items-center justify-between px-4 py-3 shadow ${
          theme ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-xl font-bold text-purple-700">Xpenso</div>
        <button onClick={() => setMenu(!menu)} className="text-2xl">
          <IoMenu />
        </button>
        {menu && (
          <div
            className={`absolute top-14 right-2 border w-56 rounded-md shadow-lg z-50 ${
              theme ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-col items-center px-4 py-3">
              <img
                src={profilePic}
                alt="User"
                className="w-14 h-14 rounded-full mb-2"
              />
              <p className="text-sm font-medium">Welcome, {name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {currentUserEmail}
              </p>
            </div>
            <div className="py-2 flex flex-col">
              <button
                onClick={handleNavigation("/dashboard")}
                className={isActive("/dashboard")}
              >
                Dashboard
              </button>
              <button
                onClick={handleNavigation("/income")}
                className={isActive("/income")}
              >
                Income
              </button>
              <button
                onClick={handleNavigation("/expense")}
                className={isActive("/expense")}
              >
                Expense
              </button>
              <button
                onClick={handleNavigation("/loan")}
                className={isActive("/loan")}
              >
                Loan Suggestion
              </button>
              <button
                onClick={logoutHandler}
                className="text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
            <button
              onClick={() => setTheme(!theme)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition duration-300 bg-purple-600 text-white hover:bg-purple-700"
            >
              {theme ? (
                <IoSunnyOutline size={20} />
              ) : (
                <IoMoonOutline size={20} />
              )}
              {theme ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </div>
  )
}

export default NavbarPages
