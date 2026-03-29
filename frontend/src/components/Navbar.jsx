import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify';
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const Navbar = () => {

const {isAuthenticated,setIsAuthenticated } = useContext(UserContext);
const {theme, setTheme} = useContext(UserContext)

    const navigate = useNavigate()

    const registerUser = ()=>{
    navigate('/login')
    }

    const LogoutUser = ()=>{
      localStorage.removeItem('token')
    setIsAuthenticated(false)
    toast.success('Successfully Logout', { autoClose: 1000 });
        navigate('/login')
    }

    const navigateToHome = () => {
        navigate('/')
    }

    

  return (
    <div>
  <div className={`flex items-center justify-between p-3 shadow-md 
  ${theme 
    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100' 
    : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'}`}
>
   <div
          onClick={navigateToHome}
          className={`p-1 text-3xl font-bold cursor-pointer hover:opacity-90 transition-opacity duration-200 ${theme ? 'text-purple-600' : 'text-white'}`}
        >
          Xpenso
        </div>


   <div className="mt-auto">
           <button
             onClick={() => setTheme(!theme)}
             aria-label="Toggle theme"
             className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition duration-300 font-medium ${
               theme
                 ? 'bg-purple-500 text-white hover:bg-purple-600'
                 : 'bg-purple-900 text-white hover:bg-purple-600'
             }`}
           >
             {theme ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
             {theme ? 'Light Mode' : 'Dark Mode'}
           </button>
         </div>
  </div>
</div>
  )
}
    
export default Navbar
