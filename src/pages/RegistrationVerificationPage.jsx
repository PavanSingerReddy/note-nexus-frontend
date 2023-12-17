import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import VerifyToken from '../HOC(Higher-Order Component)/VerifyToken';
import IsNotAuthenticatedPage from '../HOC(Higher-Order Component)/IsNotAuthenticatedPage';

const RegistrationVerificationPage = () => {

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)


    // used to set the the progress bar when any body comes to the Registration Verification Page 
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




    return (
        <>
            <div className="relative flex min-h-[calc(100dvh)] flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
                <div className="lg:max-w-xl max-w-sm px-5 text-center flex flex-col justify-center items-center">
                    <div className='w-32 animate-jump-in'>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.81802 12.3107L10.9393 14.432L15.182 10.1893M21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12Z" stroke="#3A52EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </div>
                    <h2 className="mb-2 text-4xl font-bold text-zinc-800">User Verified Successfully</h2>
                    <p className="mb-2 text-lg text-zinc-500">Now as you have verified with your email address, you can sign in using your Email id and Password</p>
                    <Link to="/login" className="mt-3 inline-block w-full rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>
                </div>
            </div>
        </>
    )
}

// First we are checking if the RegistrationVerificationPage is not verified by using IsNotAuthenticatedPage HOC because our user must not be already logged in while verifying the new user he should logout first and then verify the new user
// we are exporting the value returned by this "VerifyToken(RegistrationVerificationPage, import.meta.env.VITE_VERIFY_USER_URL)" HOC(HIGHER-ORDER-FUNCTION) function This function returns a new function which will encapsulate this RegistrationVerificationPage component in it and also have the capability verifying the token in the url parameters of this page using the "import.meta.env.VITE_VERIFY_USER_URL"(backend url) before rendering this RegistrationVerificationPage.This HOC(HIGHER-ORDER-Function) is useful for verifying the newly registered user's with their token
export default IsNotAuthenticatedPage(VerifyToken(RegistrationVerificationPage, import.meta.env.VITE_VERIFY_USER_URL))