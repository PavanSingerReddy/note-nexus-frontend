import React, { isValidElement, useContext, useEffect, useState } from 'react'
import validator from 'validator'
import NotesContext from '../context/NotesContext'
import { Link, useNavigate } from 'react-router-dom'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility'
import AlertContext from '../context/AlertContext'

const ForgotPasswordPage = () => {


    // navigate hook which is used to navigate to the different routes in the react router dom
    const navigate = useNavigate()

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // getting setShowAlert and setAlertErrorMessage from AlertContext
    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

    // formData state which is used to store the email of the user who forgotten the password
    const [formData, setFormData] = useState({
        email: ""
    })

    // count down state which is used to set the count down timer to enable the get password reset Link button
    const [countdown, setCountdown] = useState(30);

    // is disabled state to show if the password reset Link button is disabled or not
    const [isDisabled, setIsDisabled] = useState(false);

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

    // this use effect is used to set the timer when ever user click on the password reset Link button
    useEffect(() => {
        // defining timer so that it can be used to clear the setInterval when the next time this useEffect runs using the clean up function
        let timer;
        // if the button isDisabled state is true and the countdown is greater than 0 then we set the setInterval which runs every second
        if (isDisabled && countdown > 0) {
            // setting the setInterval function which updates the state of setCountDown and decrements it by one every second from it's initial state of 30
            timer = setInterval(() => {
                // decrementing the countdown state by one
                setCountdown(countdown - 1);
            }, 1000);
            // if the button is not disabled or countdown is equal to 0 then we set the isDisabled state to false and remove the setInterval which we have set above using timer
        } else if (!isDisabled || countdown === 0) {
            setIsDisabled(false);
            clearInterval(timer);
        }

        // clean up function which is used to remove the setInterval by using the timer variable when the next time this useEffect hook get's called.so as countDown state updates every second this clean up section also run's every second which removes the previous setInterval
        return () => {
            clearInterval(timer);
        }

        // our useEffect runs every time when ever the isDisabled or countdown state updates
    }, [isDisabled, countdown]);

    // formVerifcation state is used to check if our email field contains a valid email or not
    const [formVerification, setFormVerification] = useState({
        isValid: false,
        isClicked: false

    });

    // function used to populate the email data to the FormData state when the user types anything in the email input element
    const onchangeHandler = (event) => {

        const { name, value } = event.target;
        setFormData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // function which executes when the user click on the Get Password Reset Link Button
    const getPasswordResetLink = async (event) => {
        // preventing the default behaviour of the button
        event.preventDefault()

        // validator is a npm package which is used for input fields validation here it is used to validate the email.It is used to validate the email
        const isEmailValid = validator.isEmail(formData.email);

        // updating the formVerification state and modifying the isClicked to true and also updating the isValid to reflect the validation of the email
        setFormVerification({
            isValid: isEmailValid,
            isClicked: true
        })

        // if the mail is valid then we run the below code
        if (isEmailValid) {
            // setting is disabled to true when the user clicks on the button so that he cannot send multiple forgotten password emails without waiting for 30 seconds. after 30 seconds the button get's enabled automatically
            setIsDisabled(true);
            // setting the countdown value to 30 seconds so that button will be disabled for 30 seconds
            setCountdown(30);

            // making network request to get the password reset link to the registered email
            try {
                // increasing the progress bar value
                setProgressBar((prevState) => ({
                    show: true,
                    width: 40
                }))
                // url of the backend for sending the verification mail to reset the password
                const changePasswordUrl = import.meta.env.VITE_FORGOT_PASSWORD_URL;
                // making post request with data to change the password
                await httpRequestAxiosQueueUtility.post(changePasswordUrl, formData)
                // increasing the progress bar value
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

            } catch (error) {
                // setting the show Alert to true so that we can see the alert
                setShowAlert(true)
                // setting the alert message
                setAlertErrorMessage("error sending the password reset token to the user")
                // if any error occurs while sending the link to email for resetting the password change the progress bar value to zero and hiding the progress bar
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
            }

        }

    }


    // border color of the email input field which changes its color according to the email validation
    let borderColor;

    // if the user clicked on the get password reset link button then isClicked will be true and if the user's email is valid then isValid is also becomes true.Then if both of these conditions satisfy then we change the border color to green
    if (formVerification.isClicked && formVerification.isValid) {
        borderColor = 'green'
    }
    // else if the user clicks on the get password reset link button and the email is not valid then border color becomes red
    else if (formVerification.isClicked && !formVerification.isValid) {
        borderColor = 'red'
    }
    // else the border color of the email will be blue
    else {
        borderColor = '#6b93d7'
    }

    return (
        <>

            <div className="m-3 flex justify-center items-center h-screen flex-col text-xs sm:text-sm md:text-base">

                <h2 className="mb-2 text-4xl font-bold text-zinc-800">Check your inbox</h2>
                <p className="mb-2 text-lg text-zinc-500">We are glad, that you're with us ? We've sent you a Password Reset Token to the registered email address to Reset the Email address.</p>
                <form className="flex flex-col items-start">
                    {/* Email input */}
                    <label htmlFor='Email' className='my-3 block text-base font-medium text-dark dark:text-white'>
                        Email
                    </label>
                    <div className='relative'>
                        <input
                            autoComplete='on'
                            onChange={onchangeHandler}
                            value={formData.email}
                            id='Email'
                            name='email'
                            type='email'
                            placeholder='Email'
                            style={{ borderColor }}
                            className={`w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-12 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition disabled:cursor-default disabled:bg-gray-2`}
                            autoFocus
                        />
                        <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                                <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                            </svg>
                        </span>
                        {
                            // if the email is valid and the user clicked on the get password reset link then we get enable the check mark logo on the email input else we render an empty element
                            formVerification.isValid && formVerification.isClicked ?
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
                                </span> : <></>}

                        {
                            // if the email is not valid and the user clicked on the get password reset link then we get enable the check mark logo on the email input else we render an empty element
                            !formVerification.isValid && formVerification.isClicked ?

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
                                </span> : <></>}
                    </div>
                    {/* if the email is valid and the user clicked on the get password reset link then we render email is valid message else we render an empty element */}
                    {formVerification.isValid && formVerification.isClicked ? <p className='mt-[10px] text-sm text-green-500'>Email is valid</p> : <></>}

                    {/* if the email is not valid and the user clicked on the get password reset link then we render Invalid email address message else we render an empty element */}
                    {!formVerification.isValid && formVerification.isClicked ? <p className='mt-[10px] text-sm text-red-500'>Invalid email address</p> : <></>}

                </form>

                <Link to="/login" className="mt-3 inline-block rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>
                <button onClick={getPasswordResetLink} className={`${!isDisabled ? `transition ease-in-out delay-150 bg-orange-600 hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300 p-2 lg:p-3 m-3 rounded-lg text-white` : `bg-gray-300 cursor-not-allowed opacity-50 p-2 lg:p-3 m-3 rounded-lg text-gray-700 shadow-md shadow-indigo-500/20`}`}>
                    Get Password Reset Link
                </button>
                {/* we hide this element but it get's displayed when the is disabled is true */}
                <span className={`mt-3 text-indigo-500 ${isDisabled ? '' : 'invisible'}`}>
                    {`Resend Token enables in (${countdown})`}
                </span>
            </div>
        </>
    )
}

export default ForgotPasswordPage