import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import api from "../api/axiosConfig";
import { FiX } from "react-icons/fi";

const ICONS = ["🛍️", "💻", "🛒", "💼", "🍽️", "🏠", "🚗", "💊", "📚", "🎬", "⚡", "🚆", "🎁"];

const AddExpenseForm = ({ onClose }) => {
  const { userData, currentUserEmail, updateTransactions, editableExpenseData, setEditableExpenseData } = useData();
  const { theme } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    icon: ICONS[0],
  });

  useEffect(() => {
    if (editableExpenseData) {
      const isoDate = new Date(editableExpenseData.date).toISOString().split("T")[0];
      setForm({
        category: editableExpenseData.label || "",
        amount: Math.abs(editableExpenseData.amount) || "",
        icon: editableExpenseData.icon || ICONS[0],
        date: isoDate,
      });
    }
  }, [editableExpenseData]);

  const changeHandler = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setEditableExpenseData(null);
    if (onClose) onClose();
    navigate("/expense");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newExpenseAmount = Math.abs(parseFloat(form.amount));

    if (!editableExpenseData) {
      const existing = userData[currentUserEmail]?.transactions || [];
      const balance = existing.reduce((acc, t) => acc + t.amount, 0);

      if (newExpenseAmount > balance) {
        toast.error("Expense exceeds available balance!", { autoClose: 2500 });
        return;
      }
    }

    const payload = {
      amount: -newExpenseAmount,
      label: form.category,
      date: new Date(form.date).toISOString(),
      icon: form.icon,
    };

    try {
      if (editableExpenseData && editableExpenseData._id) {
        await api.patch(`/transactions/${editableExpenseData._id}`, payload);
        toast.success("Expense Updated");
      } else {
        await api.post("/transactions", payload);
        toast.success("Expense Added");
      }
      await updateTransactions();
      setEditableExpenseData(null);
      setForm({ category: "", amount: "", date: "", icon: ICONS[0] });
      if (onClose) onClose();
      navigate("/expense");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all opacity-100">
      <div className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl relative transition-all translate-y-0 scale-100 ${
        theme ? "bg-[#0f172a] border border-gray-800 text-white" : "bg-white border border-gray-100 text-gray-900"
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {editableExpenseData ? "Update Expense" : "New Expense"}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={`p-2 rounded-full transition-colors ${theme ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 tracking-wide ${theme ? "text-gray-400" : "text-gray-600"}`}>
                Icon
              </label>
              <div className="relative">
                <select
                  name="icon"
                  value={form.icon}
                  onChange={changeHandler}
                  className={`w-full appearance-none px-4 py-3.5 text-2xl text-center rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-rose-500 ${
                    theme ? "bg-gray-900 border-gray-700 text-white focus:ring-rose-500/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-500/20"
                  }`}
                  required
                >
                  {ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 tracking-wide ${theme ? "text-gray-400" : "text-gray-600"}`}>
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={changeHandler}
                className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-rose-500 ${
                  theme ? "bg-gray-900 border-gray-700 text-white focus:ring-rose-500/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-500/20"
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 tracking-wide ${theme ? "text-gray-400" : "text-gray-600"}`}>
              Category / Label
            </label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Grocery, Electricity Bill"
              value={form.category}
              onChange={changeHandler}
              className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-rose-500 placeholder-gray-400 ${
                theme ? "bg-gray-900 border-gray-700 text-white focus:ring-rose-500/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-500/20"
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 tracking-wide ${theme ? "text-gray-400" : "text-gray-600"}`}>
              Amount (₹)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${theme?"text-gray-500":"text-gray-400"}`}>₹</span>
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={changeHandler}
                min="0.01"
                step="0.01"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border text-xl font-semibold transition-all duration-200 outline-none focus:ring-4 focus:border-rose-500 ${
                  theme ? "bg-gray-900 border-gray-700 text-white focus:ring-rose-500/20" : "bg-gray-50 border-gray-200 text-rose-600 focus:ring-rose-500/20"
                }`}
                required
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className={`flex-1 py-4 font-semibold rounded-2xl transition duration-200 ${
                theme ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/30 transition duration-200"
            >
              {editableExpenseData ? "Save Changes" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
