import { IoMenu, IoClose, IoSunnyOutline, IoMoonOutline, IoLogOutOutline } from "react-icons/io5";
import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const NavbarPages = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();
  const { menu, setMenu, theme, setTheme, setIsAuthenticated } = useContext(UserContext);
  const { name, profilePic } = userData[currentUserEmail] || {};
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavigation = (path) => () => {
    setMenu(false);
    navigate(path);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setCurrentUserEmail(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const isActive = (path) =>
    `text-left px-4 py-3 rounded-xl transition duration-200 font-medium ${
      currentPath === path
        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
        : theme
        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <div
      className={`md:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm backdrop-blur-xl transition-colors duration-300 border-b ${
        theme ? "bg-[#0b0f19]/80 border-gray-800" : "bg-white/80 border-gray-100"
      }`}
    >
      <div 
        onClick={() => navigate("/")} 
        className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 cursor-pointer"
      >
        Xpenso.
      </div>
      
      <button 
        onClick={() => setMenu(!menu)} 
        className={`p-2 rounded-lg transition-colors ${
          theme ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {menu ? <IoClose size={28} /> : <IoMenu size={28} />}
      </button>

      {menu && (
        <div
          className={`absolute top-[72px] right-4 left-4 border rounded-3xl shadow-2xl z-50 overflow-hidden transform transition-all origin-top ${
            theme ? "bg-[#0f172a] border-gray-800 shadow-black/50" : "bg-white border-gray-100 shadow-gray-200/50"
          }`}
        >
          {profilePic && (
            <div className={`flex items-center gap-4 px-6 py-5 border-b ${theme ? "border-gray-800 bg-gray-800/20" : "border-gray-100 bg-gray-50/50"}`}>
              <img
                src={profilePic}
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-indigo-100"
              />
              <div className="flex flex-col truncate">
                <p className={`text-sm font-semibold ${theme ? "text-white" : "text-gray-900"}`}>{name}</p>
                <p className={`text-xs ${theme ? "text-gray-400" : "text-gray-500"}`}>
                  {currentUserEmail}
                </p>
              </div>
            </div>
          )}

          <div className="p-3 flex flex-col gap-1">
            <button onClick={handleNavigation("/dashboard")} className={isActive("/dashboard")}>
              Dashboard
            </button>
            <button onClick={handleNavigation("/income")} className={isActive("/income")}>
              Income
            </button>
            <button onClick={handleNavigation("/expense")} className={isActive("/expense")}>
              Expenses
            </button>
            <button onClick={handleNavigation("/loan")} className={isActive("/loan")}>
              Loan Suggestion
            </button>
          </div>

          <div className={`p-3 grid grid-cols-2 gap-2 border-t ${theme ? "border-gray-800" : "border-gray-100"}`}>
            <button
              onClick={() => {
                setTheme(!theme);
                setMenu(false);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition duration-300 ${
                theme 
                ? "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20" 
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              {theme ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
              {theme ? "Light" : "Dark"}
            </button>
            
            <button
              onClick={logoutHandler}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition duration-300 ${
                theme
                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
              }`}
            >
              <IoLogOutOutline size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarPages;
