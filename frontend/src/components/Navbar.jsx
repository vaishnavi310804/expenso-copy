import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const Navbar = () => {
    const {theme, setTheme} = useContext(UserContext)
    const navigate = useNavigate()

    const navigateToHome = () => {
        navigate('/')
    }

  return (
    <div className={`sticky top-0 z-50 transition-colors duration-300 border-b backdrop-blur-xl ${
        theme ? "bg-[#0b0f19]/80 border-gray-800" : "bg-white/80 border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <div
          onClick={navigateToHome}
          className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 cursor-pointer"
        >
          Xpenso.
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(!theme)}
            aria-label="Toggle theme"
            className={`p-2.5 rounded-xl transition duration-300 font-medium ${
              theme
                ? 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {theme ? <IoSunnyOutline size={22} /> : <IoMoonOutline size={22} />}
          </button>
        </div>

      </div>
    </div>
  )
}
    
export default Navbar
