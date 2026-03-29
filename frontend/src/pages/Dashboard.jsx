import React, { useContext, useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";
import api from "../api/axiosConfig";

import TrendsChart from "../components/analytics/TrendsChart";
import CategoryChart from "../components/analytics/CategoryChart";
import InsightsList from "../components/analytics/InsightsList";

const Dashboard = () => {
  const { userData, currentUserEmail } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [trendView, setTrendView] = useState('monthly');

  useEffect(() => {
    if (userData[currentUserEmail]) {
      api.get('/transactions/analytics')
         .then(res => setAnalytics(res.data))
         .catch(err => console.error("Failed to fetch analytics:", err));
    }
  }, [userData, currentUserEmail]);

  if (!userData[currentUserEmail]) {
    return (
      <p className="text-2xl p-6 text-center text-black dark:text-white">
        User data not found.
      </p>
    );
  }

  const { name, transactions } = userData[currentUserEmail];

  if (transactions.length === 0) {
    return (
      <div className={`flex flex-col min-h-screen ${theme ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <NavbarPages />
        <div className="flex flex-1">
          <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 shadow-md bg-white dark:bg-gray-900 z-40">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 md:ml-56 lg:ml-64 transition-colors duration-300">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme ? "text-purple-300" : "text-purple-600"}`}>Welcome to Xpenso, {name}!</h2>
            <p className={`text-lg sm:text-xl mb-8 text-center max-w-lg ${theme ? "text-gray-300" : "text-gray-500"}`}>
              Your dashboard is currently empty. Start by adding your first income or expense to see your financial overview.
            </p>
            <div className="flex gap-6">
               <button onClick={() => navigate('/incomeform')} className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:scale-105 hover:shadow-green-500/50 transition-all duration-300">Add Income</button>
               <button onClick={() => navigate('/expenseform')} className="px-6 py-3 bg-gradient-to-r from-rose-400 to-red-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:scale-105 hover:shadow-red-500/50 transition-all duration-300">Add Expense</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use the analytics API for the source of truth if available, otherwise fallback to local computation
  const income = analytics ? analytics.currentMonth.income : transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expenses = analytics ? analytics.currentMonth.expense : transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const balance = Math.max(income - expenses, 0);

  const recentExpenses = transactions.filter((t) => t.amount < 0).slice(0, 5);
  const recentIncome = transactions.filter((t) => t.amount > 0).slice(0, 5);

  return (
    <div className={`flex flex-col min-h-screen ${theme ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <NavbarPages />

      <div className="flex flex-1">
        <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 z-40">
          <Sidebar />
        </div>

        <div className={`flex-1 overflow-y-auto md:ml-56 lg:ml-64 transition-colors duration-300 p-4 lg:p-8 space-y-6`}>
          
          {/* Row 1: Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Net Savings", balance],
              ["Total Income", income],
              ["Total Expenses", expenses],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`p-6 sm:p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  theme ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 text-gray-800"
                } border`}
              >
                <h3 className="mb-2 font-medium text-gray-400 uppercase tracking-wider text-sm">{label}</h3>
                <p className={`font-extrabold text-3xl sm:text-4xl tracking-tight bg-clip-text text-transparent ${
                   label === 'Net Savings' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                   label === 'Total Income' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                   'bg-gradient-to-r from-rose-400 to-red-500'
                }`}>
                  ₹{value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2 tracking-wide font-medium">THIS MONTH</p>
              </div>
            ))}
          </div>

          {!analytics ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Row 2: Insights & Category Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 h-full">
                  <InsightsList insights={analytics.insights} predictedExpense={analytics.predictedExpense} theme={theme} />
                </div>
                
                <div className={`lg:col-span-5 p-6 rounded-2xl shadow-xl border ${theme ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-50'}`}>
                  <h3 className="text-xl font-semibold mb-6">Expense Categories</h3>
                  <CategoryChart data={analytics.categoryDistribution} theme={theme} />
                </div>
              </div>

              {/* Row 3: Trends */}
              <div className={`p-6 rounded-2xl shadow-xl border ${theme ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-50'}`}>
                <TrendsChart 
                  data={trendView === 'monthly' ? analytics.monthlyTrends : analytics.weeklyTrends} 
                  theme={theme} 
                  view={trendView} 
                  setView={setTrendView} 
                />
              </div>
            </>
          )}

          {/* Row 4: Recent Transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            <div className={`rounded-2xl shadow-xl border p-6 ${theme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <h3 className="text-lg font-bold mb-4">Recent Expenses</h3>
              <ul className="space-y-4">
                {recentExpenses.length === 0 ? <p className="text-gray-500">No recent expenses.</p> : recentExpenses.map((item, i) => (
                  <li key={i} className={`flex justify-between items-center p-3 rounded-xl transition ${theme ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`text-3xl p-2 rounded-lg ${theme ? 'bg-gray-700' : 'bg-gray-100'}`}>{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </div>
                    <span className={`font-bold px-4 py-1.5 rounded-lg border ${theme ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-100'}`}>
                      - ₹{Math.abs(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-2xl shadow-xl border p-6 ${theme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <h3 className="text-lg font-bold mb-4">Recent Incomes</h3>
              <ul className="space-y-4">
                {recentIncome.length === 0 ? <p className="text-gray-500">No recent incomes.</p> : recentIncome.map((item, i) => (
                  <li key={i} className={`flex justify-between items-center p-3 rounded-xl transition ${theme ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`text-3xl p-2 rounded-lg ${theme ? 'bg-gray-700' : 'bg-gray-100'}`}>{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </div>
                    <span className={`font-bold px-4 py-1.5 rounded-lg border ${theme ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-100'}`}>
                      + ₹{Math.abs(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
