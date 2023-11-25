import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NotesContext from '../context/NotesContext'

// The user get's redirected to this page after signup
const AwaitingConfirmationPage = () => {

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

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

    }, [])


    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
            <div className="max-w-xl px-5 text-center">
                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Check your inbox</h2>
                <p className="mb-2 text-lg text-zinc-500">We are glad, that you're with us ? We've sent you a verification link to the registered email address.</p>
                <Link to="/login" className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Go To Login Page →</Link>
            </div>
        </div>
    )
}

export default AwaitingConfirmationPage