import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotesContext from '../context/NotesContext'
import Cookies from 'js-cookie';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import AlertContext from '../context/AlertContext';


const AwaitingConfirmationPage = () => {


    const [email, setEmail] = useState("")


    const navigate = useNavigate();


    const { setProgressBar } = useContext(NotesContext)


    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


    useEffect(() => {


        setProgressBar((prevState) => ({
            show: true,
            width: 100
        }))



        setTimeout(() => {
            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))
        }, 1000);


        const cookie = Cookies.get('email')

        if (cookie) {
            setEmail(cookie);
        }
        else {

            navigate('/login')
        }

    }, [])



    const [isDisabled, setIsDisabled] = useState(false);

    const [countdown, setCountdown] = useState(30);


    const handleClick = async () => {

        setIsDisabled(true);

        setCountdown(30);


        const resendVerificationTokenUrl = import.meta.env.VITE_RESEND_VERIFY_TOKEN_URL

        try {

            setProgressBar((prevState) => ({
                show: true,
                width: 75
            }))
            await httpRequestAxiosQueueUtility.post(resendVerificationTokenUrl, { email })

            setTimeout(() => {
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
            }, 1000);
        } catch (error) {

            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))


            setShowAlert(true)

            setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)

        }

    };


    useEffect(() => {

        let timer;

        if (isDisabled && countdown > 0) {

            timer = setInterval(() => {

                setCountdown(countdown - 1);
            }, 1000);

        } else if (!isDisabled || countdown === 0) {
            setIsDisabled(false);
            clearInterval(timer);
        }


        return () => {
            clearInterval(timer);
        }


    }, [isDisabled, countdown]);


    const removeEmailToken = () => {

        setProgressBar((prevState) => ({
            show: true,
            width: 75
        }))
        Cookies.remove("email");
    }

    return (


        <>

            {email ? <>

                <div className="relative flex min-h-[calc(100dvh)] flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
                    <div className="lg:max-w-xl max-w-sm px-5 text-center">
                        <h2 className="mb-2 text-4xl font-bold text-zinc-800">Check your inbox</h2>
                        <p className="mb-2 text-lg text-zinc-500">We are glad, that you're with us ? We've sent you a verification link to the registered email address.</p>
                        <Link onClick={removeEmailToken} to="/login" className="mt-3 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>

                        <button onClick={handleClick} disabled={isDisabled} className={`${!isDisabled ? 'animate-bounce mt-8 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700' : 'mt-8 inline-block w-full px-5 py-3 rounded font-medium bg-gray-300 cursor-not-allowed opacity-50'}`}>
                            Resend Verification Token
                        </button>
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