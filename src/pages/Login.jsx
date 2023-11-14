import React, { useContext, useEffect, useState } from 'react'
import noteImage from "../assets/noteImage.jpg"
import { Link, useNavigate } from 'react-router-dom'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import NotesContext from '../context/NotesContext';

const Login = () => {
  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();
  // used for setting the progress bar This state is taken from the notes context
  const { setProgressBar } = useContext(NotesContext)

  // used to set the the loading bar when any body comes to the login page 
  useEffect(() => {

    // set's the loading bar to 100 percent when we route to this page
    setProgressBar((prevState) => ({
      show: true,
      width: 100
    }))

    // set's the loading bar to 0 after 1 second and hides the loading bar
    setTimeout(() => {
      setProgressBar((prevState) => ({
        show: false,
        width: 0
      }))
    }, 1000);

  }, [])

  // form data state used to store the form data and can be used to send the user login data to the backend api
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // handles the form data change and updates the state of the form data
  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  // function which handles the login logic and send's the user data to the backend api for login
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // setting the progress bar loading to true and updating it's value
    setProgressBar((prevState) => ({
      show: true,
      width: 25
    }))

    // backend url for logging in a user
    // importing login url using the environment variables in the root directory of this application
    const url = import.meta.env.VITE_LOGIN_URL

    // try catch for handling errors when we are calling the backend api
    try {

      // increasing the progress bar value
      setProgressBar((prevState) => ({
        ...prevState,
        width: 40
      }))

      // using httpRequestAxiosQueueUtility which provides us a object for http request which is based on axios api
      const respone = await httpRequestAxiosQueueUtility.post(url, formData)

      // increasing the progress bar value
      setProgressBar((prevState) => ({
        ...prevState,
        width: 75
      }))

      // navigating to the home page after successful login
      navigate("/")
    } catch (error) {

      // if any error occurs while logging in changing the progress bar value to zero and hiding the progress bar
      setProgressBar((prevState) => ({
        show: false,
        width: 0
      }))

      // printing the error which has occured
      console.log(error)

      // logout url which logout's the user by calling the backend api which cleans any cookies present if the user accidentally logs in
      // importing logout url using the environment variables in the root directory of this application
      const logoutUrl = import.meta.env.VITE_LOGOUT_URL
      await httpRequestAxiosQueueUtility.post(logoutUrl)
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
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" onClick={handleOnSubmit} >Login</button>
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