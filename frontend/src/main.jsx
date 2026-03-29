import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ToastContainer } from 'react-toastify'
import { DataProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
    <UserContextProvider>
        <DataProvider>

            <App />
        </DataProvider>
        <ToastContainer/>
    </UserContextProvider>
)
