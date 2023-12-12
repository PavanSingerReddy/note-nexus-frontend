import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import NotesContext from '../context/NotesContext';
import LoaderContext from '../context/LoaderContext';
import FullPageLoader from './Loaders/FullPageLoader';
import AlertContext from '../context/AlertContext';

const RegistrationVerificationPage = () => {


    const location = useLocation();

    const navigate = useNavigate();


    const { setProgressBar } = useContext(NotesContext)


    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


    useEffect(() => {


        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))


    }, [])


    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);


    useEffect(() => {


        const controller = new AbortController();

        const { signal } = controller;



        const exec = async () => {



            setIsFullPageLoaderActive(true);

            const queryParams = new URLSearchParams(location.search);

            const tokenValue = queryParams.get('token');

            try {
                const verificationUrl = `${import.meta.env.VITE_VERIFY_USER_URL}?token=${tokenValue}`
                await httpRequestAxiosQueueUtility.get(verificationUrl, { signal })

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


                setIsFullPageLoaderActive(false)

            } catch (error) {


                setShowAlert(true)

                setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)


                setIsFullPageLoaderActive(false)


                navigate("/login");
            }

        }


        exec();


        return () => {
            controller.abort()
        }

    }, [])




    return (
        <>

            {isFullPageLoaderActive ? <FullPageLoader /> :

                <>

                    <div className="relative flex min-h-[calc(100dvh)] flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
                        <div className="lg:max-w-xl max-w-sm px-5 text-center flex flex-col justify-center items-center">
                            <div className='w-32 animate-jump-in'>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.81802 12.3107L10.9393 14.432L15.182 10.1893M21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12Z" stroke="#3A52EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            </div>
                            <h2 className="mb-2 text-4xl font-bold text-zinc-800">User Verified Successfully</h2>
                            <p className="mb-2 text-lg text-zinc-500">Now as you have verified with your email address, you can signin using your Email id and Password</p>
                            <Link to="/login" className="mt-3 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default RegistrationVerificationPage