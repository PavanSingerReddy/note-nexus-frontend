import React, { useContext, useEffect, useState } from 'react'
import noteImage from "../assets/noteImage.jpg"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
const Signup = () => {

  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();
  // used for setting the progress bar
  const { setProgressBar } = useContext(NotesContext)

  // used to set the the loading bar when any body comes to the signup page 
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


  // form data state used to store the form data and can be used to send the user signup data to the backend api
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    retypedpassword: ""
  })

  // handles the form data change and updates the state of the form data
  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }


  // function which handles the signup logic and send's the user data to the backend api for signup
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // setting the progress bar loading to true and updating it's value
    setProgressBar((prevState) => ({
      show: true,
      width: 25
    }))

    // checking if the password and retyped password matches.localeCompare() function returns 0 if both string match
    if (formData.password.localeCompare(formData.retypedpassword) === 0) {

      // backend url for registering a new user
      // importing sign up url using the environment variables in the root directory of this application
      const url = import.meta.env.VITE_SIGNUP_URL

      // try catch for handling errors when we are calling the backend api
      try {

        // increasing the progress bar value
        setProgressBar((prevState) => ({
          ...prevState,
          width: 40
        }))

        // using httpRequestAxiosQueueUtility which provides us a object for http request which is based on axios api
        const response = await httpRequestAxiosQueueUtility.post(url, formData);

        // increasing the progress bar value
        setProgressBar((prevState) => ({
          ...prevState,
          width: 75
        }))

        // navigating to the login page after successful signup
        navigate("/awaitConfirmation")
      } catch (error) {

        // if any error occurs while signup changing the progress bar value to zero and hiding the progress bar
        setProgressBar((prevState) => ({
          show: false,
          width: 0
        }))

        // printing the error which has occured
        console.log(error)
      }
    }
    else{
      console.error("passwords didnot match");
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
          <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
          <form>
            {/* <!-- EmailId Input --> */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">Email Id</label>
              <input type="email" id="email" name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.email} onChange={handleOnChange} autoComplete="on" />
            </div>
            {/* <!-- Username Input --> */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">Username</label>
              <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.username} onChange={handleOnChange} autoComplete="on" />
            </div>
            {/* <!-- Password Input --> */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">Password</label>
              <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.password} onChange={handleOnChange} autoComplete="on" />
            </div>
            {/* <!-- Re-entered Password Input --> */}
            <div className="mb-4">
              <label htmlFor="Re-enter Password" className="block text-gray-600">Re-enter Password</label>
              <input type="password" id="Re-enter Password" name="retypedpassword" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.retypedpassword} onChange={handleOnChange} autoComplete="on" />
            </div>
            {/* <!-- Login Button --> */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" onClick={handleOnSubmit}>Sign Up</button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div className="mt-6 text-blue-500 text-center">
            <Link to="/login" className="hover:underline">Login Here</Link>
          </div>
        </div>
      </div>
    )
  }

  export default Signup