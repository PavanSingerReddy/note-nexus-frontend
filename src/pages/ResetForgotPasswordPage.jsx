import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import LoaderContext from '../context/LoaderContext';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import FullPageLoader from './Loaders/FullPageLoader';

const ResetForgotPasswordPage = () => {


    // useLocation is a react hook which gives the current page url and the query parameters in the react router dom
    const location = useLocation();

    // use navigate is used for routing in to different webpages in the react router
    const navigate = useNavigate();

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while verifying the password reset token of the user
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // used to set the the progress bar when any body comes to the Reset Forgot Password Page 
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

    // PasswordFormData state which is used to store the data of the input password fields
    const [passwordFormData, setPasswordFormData] = useState({
        newpassword: "",
        retypednewpassword: ""
    })

    // function used to populate the password form data to the passwordFormData state when the user types anything in the input elements
    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setPasswordFormData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // when the user comes to this page then we verify the user's password reset token by calling the backend with the user's password reset token value from our react's page url query parameters
    useEffect(() => {

        // getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
        const controller = new AbortController();
        //   extracting signal from the controller of abort controller
        const { signal } = controller;


        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {


            // setting the isFullPageLoaderActive to true so that we can see the full loading page while the user is verifying the password reset token
            setIsFullPageLoaderActive(true);
            // getting all our queryparams from the url
            const queryParams = new URLSearchParams(location.search);
            // getting our token query param value from our query params
            const tokenValue = queryParams.get('token');
            // sending request to the backend to verify our password reset token
            try {
                const verificationUrl = `${import.meta.env.VITE_VERIFY_RESET_PASSWORD_VERIFICATION_TOKEN_URL}?token=${tokenValue}`
                await httpRequestAxiosQueueUtility.get(verificationUrl, { signal })
                // set's the loading bar to 100 percent when we successfully verify the password reset token
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

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

            } catch (error) {

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

                // if we got any error when we are verifying the password reset token then we send the user to the login page as the token is not valid
                navigate("/login");
            }

        }

        // executing our async function
        exec();

        // if this page unmounts then we are aborting the above network request to verify the password reset token.this return statement is useful to abort multiple network request when we are in developer mode of react
        return () => {
            controller.abort()
        }

    }, [])



    const changePassword = async () => {
        try {
            // getting all our queryparams from the url
            const queryParams = new URLSearchParams(location.search);
            // getting our token query param value from our query params
            const tokenValue = queryParams.get('token');
            // reset password url
            const verificationUrl = `${import.meta.env.VITE_RESET_PASSWORD_VERIFICATION_TOKEN_URL}?token=${tokenValue}`
            await httpRequestAxiosQueueUtility.post(verificationUrl, passwordFormData)
            // set's the loading bar to 100 percent when we successfully change the password of the user
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

            // after completion of the resetting the password then we are routing the user to the login page
            navigate("/login");

        } catch (error) {
            // setting isFullPageLoaderActive state to false so that the full page loading is disabled
            setIsFullPageLoaderActive(false)

            // if we got any error when we are changing the password of the user we send the user to the login page
            navigate("/login");
        }
    }

    return (
        <>

            {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
            {isFullPageLoaderActive ? <FullPageLoader /> :
                <>
                    <div className="m-3 flex justify-center items-center h-[90vh] flex-col text-xs sm:text-sm md:text-base">
                        <form className="flex flex-col items-start">
                            {/* new password input */}
                            <label htmlFor='New Password' className='my-3 block text-base font-medium text-dark dark:text-white'>
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    autoComplete='on'
                                    onChange={onchangeHandler}
                                    value={passwordFormData.newpassword}
                                    id='New Password'
                                    name='newpassword'
                                    type='password'
                                    placeholder='New Password'
                                    className='w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                />
                                <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </span>
                            </div>
                            {/* re-enter new password */}
                            <label htmlFor='Re-enter New Password' className='my-3 block text-base font-medium text-dark dark:text-white'>
                                Re-enter New Password
                            </label>
                            <div className='relative'>
                                <input
                                    autoComplete='on'
                                    onChange={onchangeHandler}
                                    value={passwordFormData.retypednewpassword}
                                    id='Re-enter New Password'
                                    name='retypednewpassword'
                                    type='password'
                                    placeholder='Re-enter New Password'
                                    className='w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                />
                                <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </span>
                            </div>
                        </form>
                        <button onClick={changePassword} className="transition ease-in-out delay-150 bg-orange-600 hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300 p-2 lg:p-3 m-3 rounded-lg text-white">
                            Change Password
                        </button>
                    </div>
                </>
            }
        </>
    )
}

export default ResetForgotPasswordPage