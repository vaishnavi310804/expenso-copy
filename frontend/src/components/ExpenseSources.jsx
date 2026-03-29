import React, { useContext } from "react";
import { useData } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";

const ExpenseSources = () => {
  const { userData, currentUserEmail, updateTransactions,setEditableExpenseData } = useData();
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
  const expenseData = transactions.filter((t) => t.amount < 0);

  const middleIndex = Math.ceil(expenseData.length / 2);
  const leftColumn = expenseData.slice(0, middleIndex);
  const rightColumn = expenseData.slice(middleIndex);


  const handleDelete = async (idToDelete) => {
    try {
      await api.delete(`/transactions/${idToDelete}`);
      updateTransactions(); // Refresh list
      toast.error("Expense deleted!", { autoClose: 2000 });
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete expense", { autoClose: 2000 });
    }
  };

  const handleEdit=(item)=> {
    setEditableExpenseData(item);
    navigate('/expenseform');
  };

  const ExpenseCard = (item) => (
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

      <div className="text-red-600 font-medium mr-2">
        -₹{Math.abs(item.amount).toLocaleString()}
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
          Expense Sources
        </h2>
        <button
          onClick={() => {
            const csv = [
              ["Category", "Amount", "Date"],
              ...expenseData.map((item) => [
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
            link.download = "expense_details.csv";
            link.click();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-700 transition"
        >
          Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">{leftColumn.map(ExpenseCard)}</div>
        <div className="space-y-2">{rightColumn.map(ExpenseCard)}</div>
      </div>
    </div>
  );
};

export default ExpenseSources;
