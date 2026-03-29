import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { UserContext } from '../context/UserContext';
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const Sidebar = () => {
  const { userData, currentUserEmail, setCurrentUserEmail } = useData();
  const { theme, setTheme, setIsAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!userData[currentUserEmail]) {
    return (
      <p className="text-2xl p-6 text-center text-black">
        User data not found.
      </p>
    );
  }

  const { name, email, profilePic } = userData[currentUserEmail];

  const handleNavigation = (path) => () => navigate(path);

  const isActive = (path) =>
    `w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
      currentPath === path
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 tracking-wide'
        : theme
          ? 'text-gray-300 hover:bg-gray-800 hover:text-purple-400'
          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm'
    }`;

  const logoutHandler = () => {
    localStorage.removeItem('token');
    setCurrentUserEmail(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div
      className={`p-4 flex flex-col md:flex-col lg:w-64 w-full md:h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300 ${
        theme ? 'bg-gray-900 border-r border-gray-800 text-white' : 'bg-white/95 backdrop-blur-xl border-r border-purple-50 text-gray-900'
      }`}
    >
      <div
        onClick={() => navigate('/')}
        className={`text-4xl font-extrabold cursor-pointer p-4 mb-6 md:mb-10 text-center tracking-tight bg-clip-text text-transparent ${
          theme 
            ? 'bg-gradient-to-r from-purple-400 to-indigo-300 hover:from-purple-300 hover:to-indigo-200' 
            : 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700'
        }`}
      >
        Xpenso
      </div>

      <div className="flex flex-col items-center mb-4 md:mb-6">
        <img
          src={profilePic}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-4 border-purple-500 shadow-lg hover:scale-105 transition-transform"
        />
        <h2 className={`mt-2 text-lg font-semibold ${theme ? 'text-white' : 'text-purple-800'}`}>
          Welcome, {name}
        </h2>
        <p className={`text-sm ${theme ? 'text-purple-300' : 'text-purple-500'}`}>{email}</p>
      </div>

      <div className="flex flex-col md:flex-col gap-2 mb-4 md:mb-6">
        <button onClick={handleNavigation('/dashboard')} className={isActive('/dashboard')}>
          Dashboard
        </button>
        <button onClick={handleNavigation('/income')} className={isActive('/income')}>
          Income
        </button>
        <button onClick={handleNavigation('/expense')} className={isActive('/expense')}>
          Expense
        </button>
        <button onClick={handleNavigation('/loan')} className={isActive('/loan')}>
          Loan Suggestion
        </button>
        <button
          onClick={logoutHandler}
          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold mt-4 ${
            theme
              ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20'
              : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20'
          }`}
        >
          Logout
        </button>
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setTheme(!theme)}
          aria-label="Toggle theme"
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
            theme
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {theme ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
          {theme ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;