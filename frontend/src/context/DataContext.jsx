import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { UserContext } from './UserContext';

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  
  const [editableExpenseData, setEditableExpenseData] = useState(null);
  const [editableIncomeData, setEditableIncomeData] = useState(null);

  const fetchTransactions = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [isAuthenticated]);

  
  const currentUserEmail = user?.email || "guest@app.com";
  const setCurrentUserEmail = () => {}; 

  const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = income - expenses;

  const userData = {
    [currentUserEmail]: {
      name: user?.fullName || "User",
      email: currentUserEmail,
      profilePic: user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      transactions,
      income,
      expenses,
      balance
    }
  };

  const contextValue = {
    userData,
    setUserData: () => {}, 
    currentUserEmail,
    setCurrentUserEmail,
    updateTransactions: fetchTransactions, 
    refreshTransactions: fetchTransactions,
    editableExpenseData,
    setEditableExpenseData,
    editableIncomeData,
    setEditableIncomeData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
