import React from 'react'
import Navbar from './components/Navbar'
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

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/income' element={<Income />} />
          <Route path='/expense' element={<Expense />} />
          <Route path='/form' element={<Form />} />
          <Route path='/expenseform' element={<AddExpenseForm />} />
          <Route path='/incomeform' element={<AddIncomeForm />} />
          <Route path='/loan' element={<Loan />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
