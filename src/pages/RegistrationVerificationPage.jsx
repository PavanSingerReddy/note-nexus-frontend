import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import NotesContext from '../context/NotesContext';
import LoaderContext from '../context/LoaderContext';
import FullPageLoader from './Loaders/FullPageLoader';
import AlertContext from '../context/AlertContext';

const RegistrationVerificationPage = () => {

    // useLocation is a react hook which gives the current page url and the query parameters in the react router dom
    const location = useLocation();
    // use navigate is used for routing in to different webpages in the react router
    const navigate = useNavigate();

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // getting setShowAlert and setAlertErrorMessage from AlertContext
    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

    // used to set the the progress bar when any body comes to the Registration Verification Page 
    useEffect(() => {

        // set's the progress bar to 80 percent when we route to this page
        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))


    }, [])

    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while verifying the registration of the user
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // when the user comes to this page then we verify the user's registration by calling the backend with the user's verification token value from our react's page url query parameters
    useEffect(() => {

        //   getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
        const controller = new AbortController();
        //   extracting signal from the controller of abort controller
        const { signal } = controller;


        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {


            // setting the isFullPageLoaderActive to true so that we can see the full loading page while the user is verifying the registration
            setIsFullPageLoaderActive(true);
            // getting all our query params from the url
            const queryParams = new URLSearchParams(location.search);
            // getting our token query param value from our query params
            const tokenValue = queryParams.get('token');
            // sending request to the backend to verify our registration by using the registration token
            try {
                const verificationUrl = `${import.meta.env.VITE_VERIFY_USER_URL}?token=${tokenValue}`
                await httpRequestAxiosQueueUtility.get(verificationUrl, { signal })
                // set's the progress bar to 100 percent when we successfully verify the user and enable the user
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

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

            } catch (error) {

                // setting the show Alert to true so that we can see the alert
                setShowAlert(true)
                // setting the alert message based on the error response
                setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

                // if we got any error when we are verifying the user we send the user to the login page as the user is not verified still
                navigate("/login");
            }

        }

        // executing our async function
        exec();

        // if this page unmounts then we are aborting the above network request to verify the user this is use ful to abort multiple network request when we are in developer mode of react
        return () => {
            controller.abort()
        }

    }, [])




    return (
        <>
            {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
            {isFullPageLoaderActive ? <FullPageLoader /> :

                <>

                    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
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