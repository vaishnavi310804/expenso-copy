import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const IncomeSources = () => {
  const { userData, currentUserEmail, updateTransactions,setEditableIncomeData} = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  if (!userData[currentUserEmail]) {
    return (
      <p className="text-2xl p-6 text-center text-black">
        User data not found.
      </p>
    );
  }

  const { transactions } = userData[currentUserEmail];
  const incomeData = transactions.filter((t) => t.amount > 0);

  const middleIndex = Math.ceil(incomeData.length / 2);
  const leftColumn = incomeData.slice(0, middleIndex);
  const rightColumn = incomeData.slice(middleIndex);


  const handleDelete = async (idToDelete) => {
    try {
      await api.delete(`/transactions/${idToDelete}`);
      updateTransactions(); // Refresh list
      toast.error("Income deleted !", { autoClose: 2000 });
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete income", { autoClose: 2000 });
    }
  };

  const handleEdit=(item)=> {
    setEditableIncomeData(item);
    navigate('/incomeform');
  };

  const IncomeCard = (item) => (
    <div
      key={item._id || item.id}
      className={`flex items-center justify-between gap-4 p-4 mb-4 rounded-md hover:shadow-md transition ${
        theme ? "bg-gray-300" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-5 flex-grow">
        <div className="text-3xl">{item.icon}</div>
        <div>
          <div
            className={`text-lg font-semibold ${
              theme ? "text-black" : "text-gray-800"
            }`}
          >
            {item.label}
          </div>
          <div
            className={`text-sm ${theme ? "text-black" : "text-gray-500"}`}
          >
            {item.date}
          </div>
        </div>
      </div>

 
      <div className="text-green-600 font-medium mr-2">
        +₹{item.amount.toLocaleString()}
      </div>

  
      <div className="flex gap-3">
        <button
          onClick={() => handleEdit(item)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => handleDelete(item._id || item.id)}
          className="text-red-600 hover:text-red-800"
          title="Delete"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-3xl font-semibold ${
            theme ? "text-white" : "text-gray-800"
          }`}
        >
          Income Sources
        </h2>
        <button
          onClick={() => {
            const csv = [
              ["Category", "Amount", "Date"],
              ...incomeData.map((item) => [
                item.label,
                item.amount,
                item.date,
              ]),
            ]
              .map((e) => e.join(","))
              .join("\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "income_details.csv";
            link.click();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-700 transition"
        >
          Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">{leftColumn.map(IncomeCard)}</div>
        <div className="space-y-2">{rightColumn.map(IncomeCard)}</div>
      </div>
    </div>
  );
};

export default IncomeSources;
