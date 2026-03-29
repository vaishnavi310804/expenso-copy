
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DataContext } from '../context/DataContext';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from '../api/axiosConfig';

const Login = () => {
  const { setUser, setIsAuthenticated, theme,showPassword, setShowPassword } = useContext(UserContext);
  const { userData, setCurrentUserEmail } = useContext(DataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    pass: '',
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.pass
      });
      
      setUser({ fullName: res.data.name, email: res.data.email, ...res.data });
      setCurrentUserEmail(form.email);
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      toast.success('Successfully Logged In', { autoClose: 1000 });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', { autoClose: 1500 });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme ? "bg-gray-800" : "bg-purple-100"}`}>
      <Navbar />
      <div className={`flex justify-center items-center flex-1 px-4 sm:px-6 transition-colors duration-300 ${
        theme ? 'bg-gray-800' : 'bg-purple-300'
      }`}>
        <form
          onSubmit={submitHandler}
          className={`w-full max-w-[90%] sm:max-w-md ${
            theme ? 'bg-gray-300' : 'bg-white border'
          } border-gray-300 rounded-lg shadow-lg p-6 sm:p-8`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold text-center mb-6 text-purple-800`}>
            Login
          </h2>

     
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-purple-600 mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="abc@gmail.com"
              className={`w-full px-4 py-2 border text-sm sm:text-base ${
                theme ? 'bg-gray-200 placeholder:text-gray-700' : 'placeholder:text-gray-600'
              } border-gray-300 rounded-lg`}
              value={form.email}
              onChange={changeHandler}
              required
            />
          </div>

        
          <div className="mb-6">
            <label htmlFor="pass" className="block text-sm font-semibold text-purple-600 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="pass"
                id="pass"
                placeholder="Enter your Password"
                className={`w-full px-4 py-2 border text-sm sm:text-base ${
                  theme ? 'bg-gray-200 placeholder:text-gray-700' : 'placeholder:text-gray-600'
                } border-gray-300 rounded-lg pr-10`}
                value={form.pass}
                onChange={changeHandler}
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md text-sm sm:text-base"
          >
            Submit
          </button>

          <div className="mt-4 text-center">
            <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-800 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

