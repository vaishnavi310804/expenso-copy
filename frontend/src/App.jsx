import React from 'react'
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Income from './pages/Income'
import Expense from './pages/Expense'
import Form from './components/Form'
import AddExpenseForm from './components/AddExpenseForm'
import Loan from './pages/Loan'
import AddIncomeForm from './components/AddIncomeForm'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/income' element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path='/expense' element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path='/form' element={<ProtectedRoute><Form /></ProtectedRoute>} />
          <Route path='/expenseform' element={<ProtectedRoute><AddExpenseForm /></ProtectedRoute>} />
          <Route path='/incomeform' element={<ProtectedRoute><AddIncomeForm /></ProtectedRoute>} />
          <Route path='/loan' element={<ProtectedRoute><Loan /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
