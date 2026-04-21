import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const IncomeSources = () => {
  const { userData, currentUserEmail, updateTransactions, setEditableIncomeData } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  if (!userData[currentUserEmail]) return null;

  const { transactions } = userData[currentUserEmail];
  const incomeData = transactions.filter((t) => t.amount > 0).sort((a,b) => new Date(b.date) - new Date(a.date));

  const handleDelete = async (idToDelete) => {
    try {
      await api.delete(`/transactions/${idToDelete}`);
      updateTransactions();
      toast.error("Income deleted", { autoClose: 2000 });
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete income", { autoClose: 2000 });
    }
  };

  const handleEdit = (item) => {
    setEditableIncomeData(item);
    navigate('/incomeform');
  };

  const downloadCSV = () => {
    const csv = [
      ["Category", "Amount", "Date"],
      ...incomeData.map((item) => [
        item.label,
        item.amount,
        new Date(item.date).toLocaleDateString(),
      ]),
    ].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "income_details.csv";
    link.click();
  };

  const IncomeCard = (item) => (
    <div
      key={item._id || item.id}
      className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        theme 
          ? "bg-[#1e293b]/50 hover:bg-[#1e293b] border-transparent hover:border-gray-700" 
          : "bg-gray-50/50 hover:bg-white border-transparent hover:border-gray-100 hover:shadow-gray-200/50"
      }`}
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
          theme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}>
          {item.icon}
        </div>
        <div>
          <div className="text-lg font-bold">{item.label}</div>
          <div className={`text-sm tracking-wide ${theme ? "text-gray-400" : "text-gray-500"}`}>
            {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xl font-bold tracking-tight text-emerald-500">
          +₹{Math.abs(item.amount).toLocaleString()}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleEdit(item)}
            className={`p-2.5 rounded-xl transition-colors ${
              theme ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item._id || item.id)}
            className={`p-2.5 rounded-xl transition-colors ${
              theme ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Income History</h2>
          <p className={`text-sm mt-1 ${theme ? "text-gray-400" : "text-gray-500"}`}>Manage your past earning records.</p>
        </div>
        <button
          onClick={downloadCSV}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
            theme ? "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
          }`}
        >
          <FaDownload /> CSV Report
        </button>
      </div>

      <div className="space-y-3">
        {incomeData.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No income records found.</div>
        ) : (
          incomeData.map(IncomeCard)
        )}
      </div>
    </div>
  );
};

export default IncomeSources;
