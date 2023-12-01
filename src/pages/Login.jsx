import React, { useContext, useEffect, useState } from 'react'
import noteImage from "../assets/noteImage.jpg"
import { Link, useNavigate } from 'react-router-dom'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import NotesContext from '../context/NotesContext';
import validator from 'validator';
import AlertContext from '../context/AlertContext';


const Login = () => {
  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();
  // used for setting the progress bar This state is taken from the notes context
  const { setProgressBar } = useContext(NotesContext)

  // getting setShowAlert and setAlertErrorMessage from AlertContext
  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

  // used to set the the progress bar when any body comes to the login page 
  useEffect(() => {

    // set's the progress bar to 100 percent when we route to this page
    setProgressBar((prevState) => ({
      show: true,
      width: 100
    }))

    // set's the progress bar to 0 after 1 second and hides the progress bar
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

  // formValidation state is used to store the variables required for validating the input fields
  const [formValidation, setFormValidation] = useState({
    isEmailValid: false,
    isPasswordValid: false,
    isClicked: false
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


    // checking if the email entry is valid or not
    const isEmailValid = validator.isEmail(formData.email)

    // checking if the password entry is empty or not
    const isPasswordValid = !validator.isEmpty(formData.password)

    // setting form validation state according to their values
    setFormValidation({
      ...formValidation,
      isEmailValid: isEmailValid,
      isPasswordValid: isPasswordValid,
      isClicked: true
    })

    // checking if the isEmailValid and isPasswordValid are true or not. if all of them are true then only we perform the login functionality
    if (isEmailValid && isPasswordValid) {


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

        // setting the show Alert to true so that we can see the alert
        setShowAlert(true)
        // setting the alert message based on the error response
        setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
      }
    } else {
      // setting the show Alert to true so that we can see the alert
      setShowAlert(true)
      // setting the alert message
      setAlertErrorMessage("error while doing logging in")

    }
  }

  // border color of the email input field which changes its color according to the email validation
  let emailIdBorderColor;
  // border color of the password input field which changes its color according to the password validation
  let passwordBorderColor;



  // if the user clicked on the login button then isClicked will be true and if the user's email id is valid then isEmailValid also becomes true.And Then if all of these two conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isEmailValid) {
    emailIdBorderColor = 'green'
  }
  // else if the user clicks on the login button and the isEmailValid is not valid then border color becomes red
  else if (formValidation.isClicked && !formValidation.isEmailValid) {
    emailIdBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    emailIdBorderColor = '#6b93d7'
  }



  // if the user clicked on the login button then isClicked will be true and if the user's password is not blank then isPasswordValid will also becomes true .And Then if all two of these conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isPasswordValid) {
    passwordBorderColor = 'green'
  }
  // else if the user clicks on the login button and the password is not valid then border color becomes red
  else if (formValidation.isClicked && !formValidation.isPasswordValid) {
    passwordBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    passwordBorderColor = '#6b93d7'
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
            <div className='relative'>
              <input type="email" id="email" name="email" placeholder='Email Id' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.email} onChange={handleOnChange} style={{ borderColor: emailIdBorderColor }} autoComplete="on" />

              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-envelope-at" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                  <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                </svg>
              </span>

              {/* if isCliked is true and isEmailValid is true then we render the tick mark symbol svg */}
              {

                formValidation.isClicked && formValidation.isEmailValid ?

                  <span className='absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.0512 3.14409C11.5739 2.48584 9.9234 2.32277 8.34584 2.6792C6.76829 3.03562 5.34821 3.89245 4.29741 5.12189C3.2466 6.35133 2.62137 7.88751 2.51496 9.50132C2.40854 11.1151 2.82665 12.7201 3.70692 14.0769C4.58719 15.4337 5.88246 16.4695 7.39955 17.03C8.91664 17.5905 10.5743 17.6456 12.1252 17.187C13.6762 16.7284 15.0373 15.7808 16.0057 14.4855C16.9741 13.1901 17.4978 11.6164 17.4987 9.99909V9.2329C17.4987 8.77266 17.8718 8.39956 18.332 8.39956C18.7923 8.39956 19.1654 8.77266 19.1654 9.2329V9.99956C19.1642 11.9763 18.5242 13.9002 17.3406 15.4834C16.157 17.0666 14.4934 18.2248 12.5978 18.7853C10.7022 19.3457 8.67619 19.2784 6.82196 18.5934C4.96774 17.9084 3.38463 16.6423 2.30875 14.984C1.23286 13.3257 0.72184 11.3641 0.851902 9.39166C0.981963 7.41922 1.74614 5.54167 3.03045 4.03902C4.31477 2.53637 6.05042 1.48914 7.97854 1.05351C9.90666 0.617872 11.9239 0.817181 13.7295 1.62171C14.1499 1.80902 14.3389 2.30167 14.1516 2.72206C13.9642 3.14246 13.4716 3.3314 13.0512 3.14409Z"
                        fill="#22AD5C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.9236 2.74378C19.2492 3.06906 19.2495 3.59669 18.9242 3.92229L10.5909 12.264C10.4346 12.4204 10.2226 12.5083 10.0015 12.5083C9.78042 12.5084 9.56838 12.4206 9.41205 12.2643L6.91205 9.76426C6.58661 9.43882 6.58661 8.91118 6.91205 8.58574C7.23748 8.26031 7.76512 8.26031 8.09056 8.58574L10.001 10.4962L17.7451 2.74437C18.0704 2.41877 18.598 2.41851 18.9236 2.74378Z"
                        fill="#22AD5C"
                      />
                    </svg>
                  </span>

                  : <></>
              }


              {/* now if isClicked is true and isEmailValid is false then we render the "!" symbol */}

              {
                formValidation.isClicked && !formValidation.isEmailValid ?


                  <span className='absolute top-1/2 right-4 -translate-y-1/2  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.9987 2.50065C5.85656 2.50065 2.4987 5.85852 2.4987 10.0007C2.4987 14.1428 5.85656 17.5007 9.9987 17.5007C14.1408 17.5007 17.4987 14.1428 17.4987 10.0007C17.4987 5.85852 14.1408 2.50065 9.9987 2.50065ZM0.832031 10.0007C0.832031 4.93804 4.93609 0.833984 9.9987 0.833984C15.0613 0.833984 19.1654 4.93804 19.1654 10.0007C19.1654 15.0633 15.0613 19.1673 9.9987 19.1673C4.93609 19.1673 0.832031 15.0633 0.832031 10.0007Z"
                        fill="#DC3545"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.0013 5.83398C10.4615 5.83398 10.8346 6.20708 10.8346 6.66732V10.0007C10.8346 10.4609 10.4615 10.834 10.0013 10.834C9.54106 10.834 9.16797 10.4609 9.16797 10.0007V6.66732C9.16797 6.20708 9.54106 5.83398 10.0013 5.83398Z"
                        fill="#DC3545"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16797 13.3333C9.16797 12.8731 9.54106 12.5 10.0013 12.5H10.0096C10.4699 12.5 10.843 12.8731 10.843 13.3333C10.843 13.7936 10.4699 14.1667 10.0096 14.1667H10.0013C9.54106 14.1667 9.16797 13.7936 9.16797 13.3333Z"
                        fill="#DC3545"
                      />
                    </svg>
                  </span> : <></>


              }

            </div>
            <div className='relative mb-8'>
              {/* if isCliked is true and isEmailValid is true then we render the "Email Id is valid" paragraph */}
              <p className={`mt-2 min-w-[90vw] absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isEmailValid ? "" : "invisible"}`}>Email Id is valid</p>
              {/* if isCliked is true and isEmailValid is false then we render the "Email Id is not valid" paragraph */}
              <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isEmailValid ? "" : "invisible"}`}>Email Id is not valid</p>
            </div>
          </div>
          {/* <!-- Password Input --> */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <div className='relative'>
              <input type="password" id="password" name="password" placeholder='Password' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.password} onChange={handleOnChange} style={{ borderColor: passwordBorderColor }} autoComplete="on" />

              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-lock" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
              </span>

              {/* if isCliked is true and isPasswordValid is also true then we render the tick mark symbol svg */}
              {

                formValidation.isClicked && formValidation.isPasswordValid ?

                  <span className='absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.0512 3.14409C11.5739 2.48584 9.9234 2.32277 8.34584 2.6792C6.76829 3.03562 5.34821 3.89245 4.29741 5.12189C3.2466 6.35133 2.62137 7.88751 2.51496 9.50132C2.40854 11.1151 2.82665 12.7201 3.70692 14.0769C4.58719 15.4337 5.88246 16.4695 7.39955 17.03C8.91664 17.5905 10.5743 17.6456 12.1252 17.187C13.6762 16.7284 15.0373 15.7808 16.0057 14.4855C16.9741 13.1901 17.4978 11.6164 17.4987 9.99909V9.2329C17.4987 8.77266 17.8718 8.39956 18.332 8.39956C18.7923 8.39956 19.1654 8.77266 19.1654 9.2329V9.99956C19.1642 11.9763 18.5242 13.9002 17.3406 15.4834C16.157 17.0666 14.4934 18.2248 12.5978 18.7853C10.7022 19.3457 8.67619 19.2784 6.82196 18.5934C4.96774 17.9084 3.38463 16.6423 2.30875 14.984C1.23286 13.3257 0.72184 11.3641 0.851902 9.39166C0.981963 7.41922 1.74614 5.54167 3.03045 4.03902C4.31477 2.53637 6.05042 1.48914 7.97854 1.05351C9.90666 0.617872 11.9239 0.817181 13.7295 1.62171C14.1499 1.80902 14.3389 2.30167 14.1516 2.72206C13.9642 3.14246 13.4716 3.3314 13.0512 3.14409Z"
                        fill="#22AD5C"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.9236 2.74378C19.2492 3.06906 19.2495 3.59669 18.9242 3.92229L10.5909 12.264C10.4346 12.4204 10.2226 12.5083 10.0015 12.5083C9.78042 12.5084 9.56838 12.4206 9.41205 12.2643L6.91205 9.76426C6.58661 9.43882 6.58661 8.91118 6.91205 8.58574C7.23748 8.26031 7.76512 8.26031 8.09056 8.58574L10.001 10.4962L17.7451 2.74437C18.0704 2.41877 18.598 2.41851 18.9236 2.74378Z"
                        fill="#22AD5C"
                      />
                    </svg>
                  </span>

                  : <></>
              }


              {/* now if isClicked is true and isPasswordValid becomes false then we render the "!" symbol */}

              {
                formValidation.isClicked && !formValidation.isPasswordValid ?


                  <span className='absolute top-1/2 right-4 -translate-y-1/2  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.9987 2.50065C5.85656 2.50065 2.4987 5.85852 2.4987 10.0007C2.4987 14.1428 5.85656 17.5007 9.9987 17.5007C14.1408 17.5007 17.4987 14.1428 17.4987 10.0007C17.4987 5.85852 14.1408 2.50065 9.9987 2.50065ZM0.832031 10.0007C0.832031 4.93804 4.93609 0.833984 9.9987 0.833984C15.0613 0.833984 19.1654 4.93804 19.1654 10.0007C19.1654 15.0633 15.0613 19.1673 9.9987 19.1673C4.93609 19.1673 0.832031 15.0633 0.832031 10.0007Z"
                        fill="#DC3545"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.0013 5.83398C10.4615 5.83398 10.8346 6.20708 10.8346 6.66732V10.0007C10.8346 10.4609 10.4615 10.834 10.0013 10.834C9.54106 10.834 9.16797 10.4609 9.16797 10.0007V6.66732C9.16797 6.20708 9.54106 5.83398 10.0013 5.83398Z"
                        fill="#DC3545"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16797 13.3333C9.16797 12.8731 9.54106 12.5 10.0013 12.5H10.0096C10.4699 12.5 10.843 12.8731 10.843 13.3333C10.843 13.7936 10.4699 14.1667 10.0096 14.1667H10.0013C9.54106 14.1667 9.16797 13.7936 9.16797 13.3333Z"
                        fill="#DC3545"
                      />
                    </svg>
                  </span> : <></>


              }

            </div>

            <div className='relative mb-8'>
              {/* if isClicked is true and isPasswordValid is true then we render the "Password is valid" paragraph */}
              <p className={`mt-2 min-w-[90vw] absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isPasswordValid ? "" : "invisible"}`}>Password is valid</p>
              {/* if isCliked is true and isPasswordValid is false then we render the "Password Must not be blank" paragraph */}
              <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isPasswordValid ? "" : "invisible"}`}>Password Must not be blank</p>
            </div>
          </div>
          {/* <!-- Remember Me Checkbox --> */}
          {/* <div className="mb-4 flex items-center">
          <input type="checkbox" id="rememberMe" name="rememberMe" className="text-blue-500"/>
          <label htmlFor="rememberMe" className="text-gray-600 ml-2">Remember Me</label>
        </div> */}
          {/* <!-- Forgot Password Link --> */}
          <div className="mb-6 text-blue-500">
            <Link to="/forgotPassword" className="hover:underline">Forgot Password?</Link>
          </div>
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