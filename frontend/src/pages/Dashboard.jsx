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
import { FiArrowUpRight, FiArrowDownRight, FiPlus, FiCalendar } from "react-icons/fi";

const Dashboard = () => {
  const { userData, currentUserEmail } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [trendView, setTrendView] = useState('monthly');
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (userData[currentUserEmail]) {
      api.get(`/transactions/analytics?month=${selectedMonth}`)
         .then(res => {
           setAnalytics(res.data);
           setApiError(false);
         })
         .catch(err => {
           console.error("Failed to fetch analytics:", err);
           setApiError(true);
         });
    }
  }, [userData, currentUserEmail, selectedMonth]);

  if (!userData[currentUserEmail]) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const { name, transactions } = userData[currentUserEmail];

  if (transactions.length === 0) {
    return (
      <div className={`flex flex-col min-h-screen transition-colors duration-300 ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
        <NavbarPages />
        <div className="flex flex-1">
          <div className="hidden md:block w-64 flex-shrink-0 z-40">
            <div className="fixed top-0 left-0 w-64 h-screen">
              <Sidebar />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className={`p-12 rounded-3xl max-w-2xl w-full border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"}`}>
              <div className="w-24 h-24 mx-auto mb-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                <FiPlus className="text-5xl text-indigo-500" />
              </div>
              <h2 className="text-3xl font-extrabold mb-4">Welcome, {name}!</h2>
              <p className={`text-lg mb-10 leading-relaxed ${theme ? "text-gray-400" : "text-gray-500"}`}>
                Your dashboard is a clean slate. Let's start tracking your wealth by adding your first transaction.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={() => navigate('/incomeform')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-1">Add Income</button>
                 <button onClick={() => navigate('/expenseform')} className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-1">Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [year, monthNum] = selectedMonth.split('-').map(Number);
  const currentMonthStart = new Date(year, monthNum - 1, 1);
  const nextMonthStart = new Date(year, monthNum, 1);
  
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= currentMonthStart && d < nextMonthStart;
  });
  
  const income = analytics ? analytics.currentMonth.income : currentMonthTransactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expenses = analytics ? analytics.currentMonth.expense : currentMonthTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const balance = Math.max(income - expenses, 0);

  const recentExpenses = currentMonthTransactions.filter((t) => t.amount < 0).slice(0, 5);
  const recentIncome = currentMonthTransactions.filter((t) => t.amount > 0).slice(0, 5);

  const MetricCard = ({ title, amount, type }) => (
    <div className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 border ${
      theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-lg shadow-gray-200/40"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-medium tracking-wide text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>{title}</h3>
        {type === 'savings' && <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"><FiPlus className="text-indigo-500"/></div>}
        {type === 'income' && <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl"><FiArrowUpRight className="text-emerald-500"/></div>}
        {type === 'expense' && <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl"><FiArrowDownRight className="text-rose-500"/></div>}
      </div>
      <p className={`font-bold text-3xl sm:text-4xl tracking-tight mb-2 ${
        theme ? "text-white" : "text-gray-900"
      }`}>
        ₹{amount.toLocaleString()}
      </p>
      <p className={`text-xs font-semibold ${
        type === 'savings' ? 'text-indigo-500' : type === 'income' ? 'text-emerald-500' : 'text-rose-500'
      }`}>SELECTED MONTH</p>
    </div>
  );

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
          
          {/* Header Row */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center pb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Financial Overview</h1>
              <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>Track your earnings, spending, and insights seamlessly.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                 <FiCalendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme ? 'text-indigo-400' : 'text-indigo-500'}`} />
                 <input 
                   type="month"
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(e.target.value)}
                   className={`pl-10 pr-4 py-2.5 rounded-xl font-medium border outline-none shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${
                     theme ? 'bg-[#0f172a] border-gray-700 text-white hover:border-gray-600 appearance-none' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                   }`}
                 />
              </div>
              <button onClick={() => navigate('/incomeform')} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/30">
                <FiPlus /> <span className="hidden sm:inline">Income</span>
              </button>
              <button onClick={() => navigate('/expenseform')} className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/30">
                <FiPlus /> <span className="hidden sm:inline">Expense</span>
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Net Savings" amount={balance} type="savings" />
            <MetricCard title="Total Income" amount={income} type="income" />
            <MetricCard title="Total Expenses" amount={expenses} type="expense" />
          </div>

          {!analytics && !apiError ? (
            <div className={`flex justify-center items-center h-64 rounded-3xl border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : apiError ? (
            <div className={`flex flex-col justify-center items-center text-center h-64 p-8 rounded-3xl border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-red-50 border-red-100"}`}>
               <span className="text-4xl mb-3">⚠️</span>
               <h3 className={`text-lg font-bold mb-2 ${theme ? "text-gray-200" : "text-gray-900"}`}>Failed to load analytics</h3>
               <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>Your data is safe, but we encountered an error connecting to the backend. Please ensure the backend is running properly.</p>
            </div>
          ) : (
            <>
              {/* Analytics Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 h-full">
                  <InsightsList insights={analytics.insights} predictedExpense={analytics.predictedExpense} theme={theme} />
                </div>
                
                <div className={`p-6 sm:p-8 rounded-3xl border ${theme ? 'bg-[#0f172a] border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/40'}`}>
                  <h3 className="text-lg font-bold mb-6 tracking-tight">Expense Heatmap</h3>
                  <CategoryChart data={analytics.categoryDistribution} theme={theme} />
                </div>
              </div>

              <div className={`p-6 sm:p-8 rounded-3xl border ${theme ? 'bg-[#0f172a] border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/40'}`}>
                <div className="mb-4">
                  <h3 className="text-lg font-bold tracking-tight">Spend Trends</h3>
                </div>
                <TrendsChart 
                  data={trendView === 'monthly' ? analytics.monthlyTrends : analytics.weeklyTrends} 
                  theme={theme} 
                  view={trendView} 
                  setView={setTrendView} 
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {/* Expenses List */}
            <div className={`rounded-3xl border p-6 sm:p-8 ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold tracking-tight">Month's Expenses</h3>
                <button onClick={()=>navigate('/expense')} className="text-sm font-semibold tracking-wide text-indigo-500 hover:text-indigo-600">View All</button>
              </div>
              <ul className="space-y-3">
                {recentExpenses.length === 0 ? <p className="text-sm py-4 text-center text-gray-400">No expenses found for this month.</p> : recentExpenses.map((item, i) => (
                  <li key={i} className={`flex justify-between items-center p-3 sm:p-4 rounded-2xl transition duration-200 border ${theme ? 'bg-gray-800/20 border-transparent hover:border-gray-700' : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${theme ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[15px]">{item.label}</span>
                        <span className={`text-xs ${theme ? 'text-gray-400':'text-gray-500'}`}>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="font-bold text-rose-500">
                      - ₹{Math.abs(item.amount).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Income List */}
            <div className={`rounded-3xl border p-6 sm:p-8 ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold tracking-tight">Month's Income</h3>
                <button onClick={()=>navigate('/income')} className="text-sm font-semibold tracking-wide text-indigo-500 hover:text-indigo-600">View All</button>
              </div>
              <ul className="space-y-3">
                {recentIncome.length === 0 ? <p className="text-sm py-4 text-center text-gray-400">No income found for this month.</p> : recentIncome.map((item, i) => (
                  <li key={i} className={`flex justify-between items-center p-3 sm:p-4 rounded-2xl transition duration-200 border ${theme ? 'bg-gray-800/20 border-transparent hover:border-gray-700' : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${theme ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[15px]">{item.label}</span>
                        <span className={`text-xs ${theme ? 'text-gray-400':'text-gray-500'}`}>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-500">
                      + ₹{Math.abs(item.amount).toLocaleString()}
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
