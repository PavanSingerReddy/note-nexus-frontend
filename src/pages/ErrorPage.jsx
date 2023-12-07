import errorImage from "../assets/ErrorImage.png"
import { Link } from 'react-router-dom'
import NotesContext from "../context/NotesContext"
import { useContext, useEffect } from "react"

const ErrorPage = () => {

    // used for setting the progress bar This state is taken from the notes context
    const { setProgressBar } = useContext(NotesContext)

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

    }, [])
    return (
        <main>
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-[calc(100dvh)] md:px-8">
                <div className="max-w-lg mx-auto flex-1 flex-row-reverse gap-12 items-center justify-between md:max-w-none md:flex">
                    <div className="flex-1 max-w-lg">
                        <img src={errorImage} />
                    </div>
                    <div className="mt-12 flex-1 max-w-lg space-y-3 md:mt-0">
                        <h3 className="text-indigo-600 font-semibold">
                            404 Error
                        </h3>
                        <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
                            Page not found
                        </p>
                        <p className="text-gray-600">
                            Sorry, the page you are looking for could not be found or has been removed.
                        </p>
                        <Link to={"/"} className="text-indigo-600 duration-150 hover:text-indigo-400 font-medium inline-flex items-center gap-x-1">
                            Go To Home page
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ErrorPage