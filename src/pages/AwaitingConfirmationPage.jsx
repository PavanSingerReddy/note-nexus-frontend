import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotesContext from '../context/NotesContext'
import Cookies from 'js-cookie';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import AlertContext from '../context/AlertContext';

// The user get's redirected to this page after signup
const AwaitingConfirmationPage = () => {

    // state which is used to store the email from the previous signup page using cookies so that it can be used to resend verification token
    const [email, setEmail] = useState("")

    // navigate hook which is used to navigate to the different routes in the react router dom
    const navigate = useNavigate();

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // getting setShowAlert and setAlertErrorMessage from AlertContext
    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

    // used to set the the loading bar when any body comes to the Awaiting confirmation page
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

        // To get the value of the cookie and set the state of Email to that cookie
        const cookie = Cookies.get('email')
        // if the cookie exists then set the email to the cookie
        if (cookie) {
            setEmail(cookie);
        }
        else {
            // if the cookie does not exists then navigate the user to login page
            navigate('/login')
        }

    }, [])


    // is disabled state to show if the button is disabled or not
    const [isDisabled, setIsDisabled] = useState(false);
    // count down state which is used to set the count down timer to enable the resend verification token button
    const [countdown, setCountdown] = useState(30);

    // This is a function which get's executed when a user clicks on the resend verification token button
    const handleClick =async () => {
        // setting is disabled to true when the user clicks on the button so that he cannot send multiple tokens without waiting for 30 seconds after 30 seconds the button get's enabled automatically
        setIsDisabled(true);
        // setting the countdown value to 30 seconds so that button will be disabled for 30 seconds
        setCountdown(30);
        // Your resend token logic here

        const resendVerificationTokenUrl = import.meta.env.VITE_RESEND_VERIFY_TOKEN_URL

        try {
            // set's the loading bar to 75 percent before the resend verification token request
            setProgressBar((prevState) => ({
                show: true,
                width: 75
            }))
            await httpRequestAxiosQueueUtility.post(resendVerificationTokenUrl, { email })
            // set's the loading bar to 100 percent after the resend verification token request is successfull and we are suing the timout to delay the progress animation so that user can notice it
            setTimeout(() => {
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
            }, 1000);
        } catch (error) {
            // if any error occurs we hide the progress bar and set it's percentage or width to 0
            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))

            // setting the show Alert to true so that we can see the alert
            setShowAlert(true)
            // setting the alert message based on the error response
            setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)

        }

    };

    // this use effect is used to set the timer when ever user click on the resend verification token
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

    // this function is used to remove the email cookie when the user clicks on login link
    const removeEmailToken = () => {
        Cookies.remove("email");
    }

    return (


        <>

            {/* if the email state is truthy then only we render this page else we render an empty page and return the user to the login page */}
            {email ? <>

                <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
                    <div className="lg:max-w-xl max-w-sm px-5 text-center">
                        <h2 className="mb-2 text-4xl font-bold text-zinc-800">Check your inbox</h2>
                        <p className="mb-2 text-lg text-zinc-500">We are glad, that you're with us ? We've sent you a verification link to the registered email address.</p>
                        <Link onClick={removeEmailToken} to="/login" className="mt-3 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>

                        {/* when the user clicks on this button we resend the verification token to the user the styles of this button is based on the isDisabled state when the user clicks on this button it remains greyed out untill the is disabled state becomes false */}
                        <button onClick={handleClick} disabled={isDisabled} className={`${!isDisabled ? 'animate-bounce mt-8 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700' : 'mt-8 inline-block w-full px-5 py-3 rounded font-medium bg-gray-300 cursor-not-allowed opacity-50'}`}>
                            Resend Verification Token
                        </button>
                        {/* we hide this element but it get's displayed when the is disabled is true */}
                        <span className={`mt-3 text-indigo-500 ${isDisabled ? '' : 'invisible'}`}>
                            {`Resend Token enables in (${countdown})`}
                        </span>
                    </div>

                </div>

            </> : <></>}
        </>
    )
}

export default AwaitingConfirmationPage