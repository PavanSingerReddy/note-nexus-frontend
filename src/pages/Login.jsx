import React, { useState } from 'react'
import noteImage from "../assets/noteImage.jpg"
import { Link, useNavigate } from 'react-router-dom'
import HttpRequestUtility from '../utils/HttpRequestUtility';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email : "",
    password:"",
})


const handleOnChange = (e)=>{
  setFormData((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value
  }));
}


const handleOnClick = async(event)=>{
  event.preventDefault();
  const url = "http://localhost:8080/api/login"
  try {
    const response = await HttpRequestUtility.getAxiosInstance().post(url,formData);
    navigate("/logout")
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
    {/* <!-- Left: Image --> */}
    <div className="w-1/2 h-screen hidden lg:block">
      <img src={noteImage} alt="Notes Application Image" className="object-cover w-full h-full" />
    </div>
    {/* <!-- Right: Login Form --> */}
    <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form>
        {/* <!-- Username Input --> */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">Email</label>
          <input type="email" id="email" name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.email} onChange={handleOnChange} autoComplete="off" />
        </div>
        {/* <!-- Password Input --> */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">Password</label>
          <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.password} onChange={handleOnChange} autoComplete="off" />
        </div>
        {/* <!-- Remember Me Checkbox --> */}
        {/* <div className="mb-4 flex items-center">
          <input type="checkbox" id="rememberMe" name="rememberMe" className="text-blue-500"/>
          <label htmlFor="rememberMe" className="text-gray-600 ml-2">Remember Me</label>
        </div> */}
        {/* <!-- Forgot Password Link --> */}
        {/* <div className="mb-6 text-blue-500">
          <Link to="#" className="hover:underline">Forgot Password?</Link>
        </div> */}
        {/* <!-- Login Button --> */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" onClick={handleOnClick} >Login</button>
      </form>
      {/* <!-- Sign up  Link --> */}
      <div className="mt-6 text-blue-500 text-center">
        <Link to="/signup" className="hover:underline">Sign up Here</Link>
      </div>
    </div>
  </div>
  )
}

export default Login