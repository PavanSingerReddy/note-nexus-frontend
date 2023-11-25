import React, { useContext, useEffect, useState } from 'react'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import { useNavigate } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import LoaderContext from '../context/LoaderContext';
import FullPageLoader from './Loaders/FullPageLoader';
import Navbar from './Navbar';


// page used to change the password of the already logged in user
const ChangePasswordPage = () => {



    // navigate hook which is used to navigate to the different routes in the react router dom
    const navigate = useNavigate()

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while authenticating the user 
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // PasswordFormData state which is used to store the data of the input password fields
    const [passwordFormData, setPasswordFormData] = useState({
        oldpassword: "",
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

    // used to set the the loading bar when any body comes to the Add Note Page 
    useEffect(() => {

        // set's the loading bar to 80 percent when we route to this page
        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))


    }, [])


    // this useEffect is used to check if the user is authenticated or not and it activates the loading page while the user is getting authenticated and after the authentication the loading page is set to false
    useEffect(() => {
        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {

            // setting the isFullPageLoaderActive to true so that we can see the full loading page
            setIsFullPageLoaderActive(true);
            // checking if the user is authenticated or not
            try {
                await httpRequestAxiosQueueUtility.isAuthenticated()

                // set's the loading bar to 100 percent when we route to this page and the authentication is successfull
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
                // if any error occurs while authenticating the user change the progress bar value to zero and hiding the progress bar
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
                // printing error if the user is not authenticated
                console.error("got error while authenticating the user");
                // logging out the user which clears all the user's cookies
                try {
                    // importing logout url from the env file
                    const logoutUrl = import.meta.env.VITE_LOGOUT_URL
                    // request used for logging out the user
                    await httpRequestAxiosQueueUtility.authenticatedPost(logoutUrl)
                } catch (error) {
                    // if any error occurs while logging out we print the error
                    console.error("error doing logout")
                }
                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)
                // after logging out the user we send the user to the login page as the user is not authenticated
                navigate("/login");
            }
        }
        // calling the exec() function to perform our user authentication process
        exec();

    }, [])


    // function which is executed when user clicks on the change password button
    const changePassword = async (event) => {
        // preventing the default behaviour of the button
        event.preventDefault()
        // checking if the new password and retyped new password matches.localeCompare() function returns 0 if both string match
        if (passwordFormData.newpassword.localeCompare(passwordFormData.retypednewpassword) === 0) {
            // making network request to change the password
            try {
                // increasing the progress bar value
                setProgressBar((prevState) => ({
                    show: true,
                    width: 40
                }))
                // url for changing the password
                const changePasswordUrl = import.meta.env.VITE_CHANGE_PASSWORD_URL;
                // making post request with data to change the password
                httpRequestAxiosQueueUtility.post(changePasswordUrl, passwordFormData)
                // increasing the progress bar value
                setProgressBar((prevState) => ({
                    show: true,
                    width: 75
                }))
                // after successfully changing the password redirect to home page
                navigate("/")
            } catch (error) {
                // if any error occurs while changing the password then we print the error
                console.error("error while saving new password")
                // if any error occurs while changing the password change the progress bar value to zero and hiding the progress bar
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
                // logging out the user which clears all the user's cookies
                try {
                    const logoutUrl = import.meta.env.VITE_LOGOUT_URL
                    await httpRequestAxiosQueueUtility.authenticatedPost(logoutUrl)
                } catch (error) {
                    // if any error occurs while logging out we print the error
                    console.error("error doing logout")
                }
                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)
                // after logging out the user we send the user to the login page as the user is not authenticated
                navigate("/login");
            }
        }
        else {
            // if the new password and re-entered new password's does not match then we console log the error
            console.error("new password and re-entered new password does not match")
        }

    }
    return (
        <>

            {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
            {isFullPageLoaderActive ? <FullPageLoader /> :

                <>
                    {/* navbar element which is used to logout a user,change password and also shows the application branding */}
                    < Navbar />
                    <div className="m-3 flex justify-center items-center h-screen flex-col text-xs sm:text-sm md:text-base">
                        <form className="flex flex-col items-start">
                            {/* previous password input */}
                            <label htmlFor='Previous Password' className='my-3 block text-base font-medium text-dark dark:text-white'>
                                Previous Password
                            </label>
                            <div className='relative'>
                                <input
                                    autoComplete='on'
                                    onChange={onchangeHandler}
                                    value={passwordFormData.oldpassword}
                                    id='Previous Password'
                                    name='oldpassword'
                                    type='password'
                                    placeholder='Previous Password'
                                    className='w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                    autoFocus
                                />
                                <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </span>
                            </div>
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
                </>}
        </>
    )
}

export default ChangePasswordPage