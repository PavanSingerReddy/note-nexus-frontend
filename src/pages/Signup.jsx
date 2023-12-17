import React, { useContext, useEffect, useState } from 'react';
import noteImage from "../assets/noteImage.jpg";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import Cookies from 'js-cookie';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import validator from 'validator';
import AlertContext from '../context/AlertContext';
import IsNotAuthenticatedPage from '../HOC(Higher-Order Component)/IsNotAuthenticatedPage';
const Signup = () => {

  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();
  // used for setting the progress bar
  const { setProgressBar } = useContext(NotesContext)

  // getting setShowAlert and setAlertErrorMessage from AlertContext
  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

  // used to set the the progress bar when any body comes to the sign up page 
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


    // To get the value of the email set by sign up page while registration and if it the email cookie is present then we delete the cookie as it is not needed here it is only needed to send the verification token again
    const cookie = Cookies.get('email')
    if (cookie) {
      Cookies.remove("email");
    }

  }, [])


  // form data state used to store the form data and can be used to send the user sign up data to the backend api
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    retypedpassword: ""
  })


  // formValidation state is used to store the variables required for validating the input fields
  const [formValidation, setFormValidation] = useState({
    isEmailValid: false,
    isUserNameValid: false,
    isPasswordValid: false,
    isReEnterdPasswordValid: false,
    doesPasswordAndReEnteredPasswordMatch: false,
    isClicked: false
  })

  // handles the form data change and updates the state of the form data
  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }


  // function which handles the sign up logic and send's the user data to the backend api for sign up
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    // checking if the email entry is valid or not
    const isEmailValid = validator.isEmail(formData.email)

    // checking if the username entry is empty or not
    const isUserNameValid = !validator.isEmpty(formData.username)

    // checking if the password entry is empty or not
    const isPasswordValid = !validator.isEmpty(formData.password)

    // checking if the retypedpassword entry is empty or not
    const isReEnterdPasswordValid = !validator.isEmpty(formData.retypedpassword)

    // checking if the password and retypedpassword matches
    const doesPasswordAndReEnteredPasswordMatch = formData.password.localeCompare(formData.retypedpassword) === 0

    // setting form validation state according to their values
    setFormValidation({
      ...formValidation,
      isEmailValid: isEmailValid,
      isUserNameValid: isUserNameValid,
      isPasswordValid: isPasswordValid,
      isReEnterdPasswordValid: isReEnterdPasswordValid,
      doesPasswordAndReEnteredPasswordMatch: doesPasswordAndReEnteredPasswordMatch,
      isClicked: true
    })



    // checking if the isEmailValid,isUserNameValid,isPasswordValid,isReEnteredPassword and doesPasswordAndReEnteredPasswordMatch if all of them are true then only we perform the sign up functionality
    if (isEmailValid && isUserNameValid && isPasswordValid && isReEnterdPasswordValid && doesPasswordAndReEnteredPasswordMatch) {

      // setting the progress bar loading to true and updating it's value
      setProgressBar((prevState) => ({
        show: true,
        width: 25
      }))
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


        // To set a session cookie which can be used in AwaitingConfirmationPage component to resend the verification token
        Cookies.set('email', formData.email);

        // navigating to the login page after successful sign up
        navigate("/awaitConfirmation")
      } catch (error) {

        // if any error occurs while sign up changing the progress bar value to zero and hiding the progress bar
        setProgressBar((prevState) => ({
          show: false,
          width: 0
        }))

        // setting the show Alert to true so that we can see the alert
        setShowAlert(true)
        // setting the alert message based on the error response
        setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
      }
    }
    else {
      // setting the show Alert to true so that we can see the alert
      setShowAlert(true)
      // setting the alert message
      setAlertErrorMessage("Error while doing sign up");
    }
  }





  // border color of the email input field which changes its color according to the email validation
  let emailIdBorderColor;
  // border color of the username input field which changes its color according to the username validation
  let userNameBorderColor;
  // border color of the password input field which changes its color according to the password validation
  let passwordBorderColor;
  // border color of the retyped password input field which changes its color according to the retyped password validation
  let reTypedPasswordBorderColor;


  // if the user clicked on the sign up button then isClicked will be true and if the user's email id is valid then isEmailValid also becomes true.And Then if all of these two conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isEmailValid) {
    emailIdBorderColor = 'green'
  }
  // else if the user clicks on the signup button and the isEmailValid is not valid then border color becomes red
  else if (formValidation.isClicked && !formValidation.isEmailValid) {
    emailIdBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    emailIdBorderColor = '#6b93d7'
  }


  // if the user clicked on the sign up button then isClicked will be true and if the user's username is not blank then isUserNameValid is also becomes true.And Then if all of these two conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isUserNameValid) {
    userNameBorderColor = 'green'
  }
  // else if the user clicks on the sign up button and the isUserNameValid is not valid then border color becomes red
  else if (formValidation.isClicked && !formValidation.isUserNameValid) {
    userNameBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    userNameBorderColor = '#6b93d7'
  }


  // if the user clicked on the sign up button then isClicked will be true and if the user's password is not blank then isPasswordValid will also becomes true and if both the password and Re-entered password match then doesPasswordAndReEnteredPasswordMatch becomes true.And Then if all three of these conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch) {
    passwordBorderColor = 'green'
  }
  // else if the user clicks on the sign up button and the password is not valid or password and re-typed password does not match then border color becomes red
  else if (formValidation.isClicked && (!formValidation.isPasswordValid || !formValidation.doesPasswordAndReEnteredPasswordMatch)) {
    passwordBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    passwordBorderColor = '#6b93d7'
  }

  // if the user clicked on the sign up button then isClicked will be true and if the user's re-typed password is not blank then isReEnterdPasswordValid will also becomes true and if the password and retyped password also matches then doesPasswordAndReEnteredPasswordMatch becomes true.And Then if all of these three conditions satisfy then we change the border color to green
  if (formValidation.isClicked && formValidation.isReEnterdPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch) {
    reTypedPasswordBorderColor = 'green'
  }
  // else if the user clicks on the sign up button and the re-typed password is not valid then border color becomes red
  else if (formValidation.isClicked && (!formValidation.isReEnterdPasswordValid || !formValidation.doesPasswordAndReEnteredPasswordMatch)) {
    reTypedPasswordBorderColor = 'red'
  }
  // else the border color of the email will be blue
  else {
    reTypedPasswordBorderColor = '#6b93d7'
  }





  return (
    <div className="bg-gray-100 flex justify-center items-center h-[calc(100dvh)]">
      {/* <!-- Left: Image --> */}
      <div className="w-1/2 h-[calc(100dvh)] hidden lg:block">
        <img src={noteImage} alt="Notes Application Image" className="object-cover w-full h-full" />
      </div>
      {/* <!-- Right: Login Form --> */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <form>
          {/* <!-- EmailId Input --> */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email Id</label>
            <div className='relative'>
              <input type="email" id="email" name="email" style={{ borderColor: emailIdBorderColor }} placeholder='Email Id' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.email} onChange={handleOnChange} autoComplete="on" />
              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-envelope-at" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                  <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                </svg>
              </span>

              {/* if isClicked is true and isEmailValid is true then we render the tick mark symbol svg */}
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
              {/* if isClicked is true and isEmailValid is true then we render the "Email Id is valid" paragraph */}
              <p className={`mt-2 absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isEmailValid ? "" : "invisible"}`}>Email Id is valid</p>
              {/* if isClicked is true and isEmailValid is false then we render the "Email Id is not valid" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isEmailValid ? "" : "invisible"}`}>Email Id is not valid</p>
            </div>
          </div>
          {/* <!-- Username Input --> */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">Username</label>
            <div className='relative'>
              <input type="text" id="username" name="username" style={{ borderColor: userNameBorderColor }} placeholder='Username' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.username} onChange={handleOnChange} autoComplete="on" />
              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </span>

              {/* if isClicked is true and isUserNameValid is true then we render the tick mark symbol svg */}
              {

                formValidation.isClicked && formValidation.isUserNameValid ?

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


              {/* now if isClicked is true and isUserNameValid false then we render the "!" symbol */}

              {
                formValidation.isClicked && !formValidation.isUserNameValid ?


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
              {/* if isClicked is true and isUserNameValid is true then we render the "Username is valid" paragraph */}
              <p className={`mt-2 absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isUserNameValid ? "" : "invisible"}`}>Username is valid</p>
              {/* if isClicked is true and isUserNameValid is false then we render the "Username Must not be blank" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isUserNameValid ? "" : "invisible"}`}>Username Must not be blank</p>
            </div>
          </div>
          {/* <!-- Password Input --> */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <div className='relative'>
              <input type="password" id="password" name="password" style={{ borderColor: passwordBorderColor }} placeholder='Password' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.password} onChange={handleOnChange} autoComplete="on" />
              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-lock" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
              </span>

              {/* if isClicked is true , isPasswordValid is true and also doesPasswordAndReEnteredPasswordMatch is also true then we render the tick mark symbol svg */}
              {

                formValidation.isClicked && formValidation.isPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch ?

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


              {/* now if isClicked is true and any of isPasswordValid or doesPasswordAndReEnteredPasswordMatch becomes false then we render the "!" symbol */}

              {
                formValidation.isClicked && (!formValidation.isPasswordValid || !formValidation.doesPasswordAndReEnteredPasswordMatch) ?


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
              {/* if isClicked is true and isPasswordValid is true and doesPasswordAndReEnteredPasswordMatch also becomes true then we render the "Password is valid" paragraph */}
              <p className={`mt-2 absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch ? "" : "invisible"}`}>Password is valid</p>
              {/* if isClicked is true and isPasswordValid is false then we render the "Password Must not be blank" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isPasswordValid ? "" : "invisible"}`}>Password Must not be blank</p>

              {/* if isClicked is true and isPasswordValid is true and doesPasswordAndReEnteredPasswordMatch becomes false then we render the "Passwords do not match" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && formValidation.isPasswordValid && !formValidation.doesPasswordAndReEnteredPasswordMatch ? "" : "invisible"}`}>Passwords do not match</p>
            </div>
          </div>
          {/* <!-- Re-entered Password Input --> */}
          <div className="mb-4">
            <label htmlFor="Re-enter Password" className="block text-gray-600">Re-enter Password</label>
            <div className='relative'>
              <input type="password" id="Re-enter Password" name="retypedpassword" style={{ borderColor: reTypedPasswordBorderColor }} placeholder='Re-enter Password' className="w-full pl-12 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" value={formData.retypedpassword} onChange={handleOnChange} autoComplete="on" />
              <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" className="bi bi-lock" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
              </span>

              {/* if isClicked is true, isReEnterdPasswordValid is true and also doesPasswordAndReEnteredPasswordMatch is true then we render the tick mark symbol svg */}
              {

                formValidation.isClicked && formValidation.isReEnterdPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch ?

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


              {/* now if isClicked is true and any of isReEnterdPasswordValid or doesPasswordAndReEnteredPasswordMatch is false then we render the "!" symbol */}

              {
                formValidation.isClicked && (!formValidation.isReEnterdPasswordValid || !formValidation.doesPasswordAndReEnteredPasswordMatch) ?


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
              {/* if isClicked is true and isReEnterdPasswordValid is true and doesPasswordAndReEnteredPasswordMatch also becomes true then we render the "Re-entered Password is valid" paragraph */}
              <p className={`mt-2 absolute text-sm text-green-500 ${formValidation.isClicked && formValidation.isReEnterdPasswordValid && formValidation.doesPasswordAndReEnteredPasswordMatch ? "" : "invisible"}`}>Re-entered Password is valid</p>
              {/* if isClicked is true and isReEnterdPasswordValid is false then we render the "Re-entered Password Must not be blank" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && !formValidation.isReEnterdPasswordValid ? "" : "invisible"}`}> Re-entered Password Must not be blank</p>

              {/* if isClicked is true and isReEnterdPasswordValid is true and doesPasswordAndReEnteredPasswordMatch becomes false then we render the "Passwords do not match" paragraph */}
              <p className={`mt-2 absolute top-0 text-sm text-red-500 ${formValidation.isClicked && formValidation.isReEnterdPasswordValid && !formValidation.doesPasswordAndReEnteredPasswordMatch ? "" : "invisible"}`}>Passwords do not match</p>
            </div>
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


// we are exporting the value returned by this "IsNotAuthenticatedPage(Signup)" HOC(HIGHER-ORDER-FUNCTION) function This function returns a new function which will encapsulate this Signup component in it and also have the capability of verifying that the user is unauthenticated(not authenticated or logged in) before rendering this Signup
export default IsNotAuthenticatedPage(Signup)