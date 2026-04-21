import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from '../api/axiosConfig';

const Register = () => {
  const { setUser, setIsAuthenticated, theme, showPassword, setShowPassword } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    pass: '',
    profilePic: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  });

  const avatars = [
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
  ];

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.pass,
        profilePic: form.profilePic
      });
      
      setUser({ fullName: res.data.name, email: res.data.email, ...res.data });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      toast.success('Account created successfully!', { autoClose: 1000 });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme ? "bg-[#0b0f19] text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />
      
      <div className="flex justify-center items-center flex-1 px-4 sm:px-6 relative overflow-hidden py-10">
        
        {/* Abstract Background Elements */}
        {theme ? (
          <>
            <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        <form
          onSubmit={submitHandler}
          className={`w-full max-w-lg p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 transition-all duration-300 ${
            theme ? 'bg-[#0f172a]/80 border border-gray-800 backdrop-blur-xl' : 'bg-white/80 border border-white/40 shadow-xl shadow-indigo-100/50 backdrop-blur-xl'
          }`}
        >
          <div className="text-center mb-8">
             <h2 className="text-3xl font-extrabold tracking-tight mb-2">Create Account</h2>
             <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>
               Start tracking your finances today
             </p>
          </div>

          <div className="mb-5">
            <label htmlFor="name" className={`block text-sm font-semibold tracking-wide mb-2 ${theme ? "text-gray-300" : "text-gray-700"}`}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-indigo-500 ${
                theme 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/20'
              }`}
              value={form.name}
              onChange={changeHandler}
              required
            />
          </div>

          <div className="mb-5">
            <label className={`block text-sm font-semibold tracking-wide mb-2 ${theme ? "text-gray-300" : "text-gray-700"}`}>
              Select Profile Avatar
            </label>
            <div className="flex gap-4">
              {avatars.map((avatar, idx) => (
                <img 
                  key={idx} 
                  src={avatar} 
                  alt="avatar" 
                  onClick={() => setForm({ ...form, profilePic: avatar })}
                  className={`w-14 h-14 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                    form.profilePic === avatar 
                      ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/50 ring-offset-2 dark:ring-offset-gray-900' 
                      : `border-transparent opacity-60 hover:opacity-100 hover:scale-105 ${theme ? 'bg-gray-800' : 'bg-gray-100'}`
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className={`block text-sm font-semibold tracking-wide mb-2 ${theme ? "text-gray-300" : "text-gray-700"}`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-indigo-500 ${
                theme 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/20'
              }`}
              value={form.email}
              onChange={changeHandler}
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="pass" className={`block text-sm font-semibold tracking-wide mb-2 ${theme ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="pass"
                id="pass"
                placeholder="Secure password"
                className={`w-full pl-4 pr-12 py-3.5 rounded-2xl border transition-all duration-200 outline-none focus:ring-4 focus:border-indigo-500 ${
                  theme 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/20'
                }`}
                value={form.pass}
                onChange={changeHandler}
                required
              />
              <button
                type="button"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${theme ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-700"}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition duration-300 shadow-lg shadow-indigo-500/30 hover:-translate-y-1"
          >
            Create Account
          </button>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
