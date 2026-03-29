import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import api from "../api/axiosConfig";

const AddExpenseForm = ({ onClose }) => {
  const {
    userData,
    currentUserEmail,
    updateTransactions,
    editableExpenseData,
  } = useData();

useEffect(() => {
  if (editableExpenseData) {
    const cleanDate = editableExpenseData.date.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const parsedDate = new Date(cleanDate);

    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date:", cleanDate);
      return;
    }

    const isoDate = parsedDate.toISOString().split("T")[0];

    setForm({
      category: editableExpenseData.label || "",
      amount: Math.abs(editableExpenseData.amount) || "",
      icon: editableExpenseData.icon || "",
      date: isoDate,
    });
  }
}, []);


  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const submitHandler = async (e) => {
  e.preventDefault();

  const existing = userData[currentUserEmail]?.transactions || [];

  const totalIncome = existing
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = existing
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const newExpenseAmount = Math.abs(parseFloat(form.amount));

  if (newExpenseAmount > balance) {
    toast.error("Expense exceeds your available balance!", { autoClose: 2000 });

    setTimeout(() => {
      navigate("/expense");
    }, 1600);

    return;
  }

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  const formattedDate = formatDate(form.date);

  const newExpense = {
    amount: -newExpenseAmount,
    label: form.category,
    date: formattedDate,
    icon: form.icon,
  };

  try {
    if (editableExpenseData && editableExpenseData._id) {
      await api.put(`/transactions/${editableExpenseData._id}`, newExpense);
    } else {
      await api.post('/transactions', newExpense);
    }
    
    updateTransactions(); // Refresh transactions from backend

  } catch (error) {
    console.error("Failed to save expense:", error);
    toast.error("Failed to save expense", { autoClose: 2000 });
    return;
  }

  toast.success("Expense Added", { autoClose: 1000 });
  setForm({ category: "", amount: "", date: "", icon: "" });

  if (onClose) onClose();
  navigate("/expense");
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add Expense
        </h2>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="icon"
            >
              Select an icon
            </label>
            <select
              name="icon"
              id="icon"
              value={form.icon}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="🛍️">🛍️</option>
              <option value="💻">💻</option>
              <option value="🛒">🛒</option>
              <option value="💼">💼</option>
              <option value="🍽️">🛍️</option>
              <option value="🍽️">🍽️</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Rent, Freelance, Salary etc."
              value={form.category}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="₹ Amount"
              value={form.amount}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="date"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={form.date}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              {editableExpenseData ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
