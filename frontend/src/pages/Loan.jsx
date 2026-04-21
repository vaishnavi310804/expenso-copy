import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import NavbarPages from "../components/NavbarPages";
import { FiExternalLink, FiPercent } from "react-icons/fi";

const LoanSuggestion = (balance) => {
  if (balance >= 50000) return []; // Only show loans if balance is somewhat low

  return [
    {
      title: "Personal Loan",
      interest: "10.5%",
      provider: "HDFC Bank",
      link: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",
    },
    {
      title: "Credit Card Upgrade",
      interest: "14%",
      provider: "ICICI Bank",
      link: "https://www.icicibank.com/Personal-Banking/cards/Consumer-Cards/Credit-Card",
    },
    {
      title: "Quick Cash Loan",
      interest: "12%",
      provider: "Bajaj Finserv",
      link: "https://www.bajajfinserv.in/personal-loan",
    },
    {
      title: "Home Renovation",
      interest: "8.5%",
      provider: "SBI Home",
      link: "https://homeloans.sbi/",
    },
  ];
};

const Loan = () => {
  const { userData, currentUserEmail } = useData();
  const { theme } = useContext(UserContext);
  const user = userData[currentUserEmail];

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
        <p className="font-medium animate-pulse text-gray-500">Loading Loan Data...</p>
      </div>
    );
  }

  // Calculate actual logical balance based on transactions
  const { transactions } = user;
  const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const actualBalance = income - expenses;

  const suggestions = LoanSuggestion(actualBalance);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
      <NavbarPages/>
      
      <div className="flex flex-1">
        <div className="hidden md:block w-64 flex-shrink-0 z-40">
          <div className="fixed top-0 left-0 w-64 h-screen">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-2 border-b border-gray-200 dark:border-gray-800 gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Loan Suggestions</h1>
              <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>Curated financial options based on your current balance.</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              actualBalance > 50000 
                ? theme ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                : theme ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              Current Balance: ₹{actualBalance.toLocaleString()}
            </div>
          </div>

          {suggestions.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${theme ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"}`}>
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl">🎉</div>
              <h2 className="text-xl font-bold mb-2">Great Financial Health!</h2>
              <p className={theme ? "text-gray-400" : "text-gray-500"}>Your balance is healthy. You do not require urgent loan suggestions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((loan, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                    theme
                      ? "bg-[#0f172a] border-gray-800 hover:border-indigo-500/30"
                      : "bg-white border-gray-100 shadow-xl shadow-gray-200/40 hover:border-indigo-200 hover:shadow-indigo-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">{loan.provider}</p>
                  <h3 className="text-xl font-bold mb-4">{loan.title}</h3>
                  
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-6 w-max ${theme ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                    <FiPercent /> <span className="font-semibold text-sm">{loan.interest} Interest Rate</span>
                  </div>

                  <div className="mt-auto">
                    <a
                      href={loan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition duration-300 shadow-sm shadow-indigo-500/25"
                    >
                      View Details <FiExternalLink />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Loan;
