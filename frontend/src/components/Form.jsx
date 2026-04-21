import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import api from "../api/axiosConfig";

const Form = ({ onClose }) => {
  const { userData, currentUserEmail, updateTransactions } = useData();

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

    const newIncome = {
      amount: parseFloat(form.amount),
      label: form.category,
      date: new Date(form.date).toISOString(),
      icon: form.icon,
    };

    try {
      await api.post('/transactions', newIncome);
      updateTransactions(); // Refresh
      toast.success("Income Added", { autoClose: 1000 });
      setForm({ category: "", amount: "", date: "", icon: "" });
      if (onClose) onClose();
      navigate("/income");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add income", { autoClose: 2000 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
        type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button> 
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Income</h2>

        <form onSubmit={submitHandler}>

            <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="icon">Select an icon</label>
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
            <label className="block text-gray-700 font-medium mb-1" htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Rent, Freelance, Salary etc."
              value={form.category}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1"
            htmlFor="amount">Amount</label>
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
            <label className="block text-gray-700 font-medium mb-1"
            htmlFor="date">Date</label>
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
              Add Income
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Form;
