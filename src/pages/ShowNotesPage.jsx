import React, { useContext, useEffect } from 'react'
import BackButton from './buttons/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoaderContext from '../context/LoaderContext';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import FullPageLoader from './Loaders/FullPageLoader';
import NotesContext from '../context/NotesContext';
import AlertContext from '../context/AlertContext';

const ShowNotesPage = () => {

    // use navigate hook which is used for routing in the react router dom
    const navigate = useNavigate()

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // getting setShowAlert and setAlertErrorMessage from AlertContext
    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

    // used to set the the progress bar when any body comes to the Add Note Page 
    useEffect(() => {

        // set's the progress bar to 100 percent when we route to this page
        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))


    }, [])

    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while authenticating the user 
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // this useEffect is used to check if the user is authenticated or not and it activates the loading page while the user is getting authenticated and after the authentication the loading page is set to false
    useEffect(() => {

        //   getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
        const controller = new AbortController()

        //   extracting signal from the controller of abort controller
        const { signal } = controller

        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {

            // setting the isFullPageLoaderActive to true so that we can see the full loading page
            setIsFullPageLoaderActive(true);
            // checking if the user is authenticated or not and passing signal to cancel the request in the below return statement of this useEffect hook if this component unmounts so that we don't need to make multiple request if this component loads two or three times repeatedly
            try {
                await httpRequestAxiosQueueUtility.isAuthenticated({ signal })

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

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)
            } catch (error) {

                // setting the show Alert to true so that we can see the alert
                setShowAlert(true)
                // setting the alert message based on the error response
                setAlertErrorMessage("got error while authenticating the user");
                // logging out the user which clears all the user's cookies
                try {
                    const logoutUrl = import.meta.env.VITE_LOGOUT_URL
                    await httpRequestAxiosQueueUtility.post(logoutUrl)
                } catch (error) {
                    // setting the show Alert to true so that we can see the alert
                    setShowAlert(true)
                    // setting the alert message based on the error response
                    setAlertErrorMessage("got error while authenticating the user and got error doing logout too")
                }
                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)
                // after logging out the user we send the user to the login page as the user is not authenticated
                navigate("/login");
            }
        }
        // calling the exec() function to perform our user authentication process
        exec();

        // if this component unmounts then we are aborting any network request if the network request are pending and not completed.if they are already completed and there are no network request pending of this useEffect then nothing happens
        return () => {
            controller.abort()
        }

    }, [])



    // use location is used to access the state which is passed in the react router dom using the useNavigate() hook
    const location = useLocation()
    const note = location.state.noteItem;

    // function which is used to handle the back button click and navigate the user to the home page
    const onClickBackButtonHandler = (event) => {
        event.preventDefault()
        // increasing the progress bar value
        setProgressBar((prevState) => ({
            show: true,
            width: 50
        }))
        navigate("/")
    }

    return (
        <>
            {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
            {isFullPageLoaderActive ? <FullPageLoader /> :
                <>
                    <Navbar />
                    <BackButton onClickBackButtonHandler={onClickBackButtonHandler} />

                    {/* Note Heading */}

                    <div className="m-3">
                        <label htmlFor="Note Heading" className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                            Note Heading
                        </label>
                        <div className='relative'>
                            <input
                                type='text'
                                id="Note Heading"
                                placeholder='Note Heading'
                                value={note.title}
                                disabled
                                className='w-full pr-3 pl-12 rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2 dark:disabled:bg-dark-4 dark:disabled:border-dark-4'
                            />
                            <span className='absolute top-1/2 left-4 -translate-y-1/2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="#9CA3AF" viewBox="0 0 16 16">
                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0M7 7v1h2V7a1 1 0 0 0-2 0M6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                </svg>
                            </span>
                        </div>

                    </div>

                    {/* Note Content */}

                    <div className="m-3">
                        <label htmlFor="Note Content" className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                            Note Content
                        </label>
                        <div className='relative'>
                            <textarea
                                id="Note Content"
                                rows='10'
                                placeholder='Note Content'
                                disabled
                                value={note.content}
                                className='w-full p-3 pl-12 rounded-md border border-stroke dark:border-dark-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark-4 dark:disabled:border-dark-4'
                            />

                            <span className='absolute top-[18px] left-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="#9CA3AF" viewBox="0 0 16 16">
                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0M7 7v1h2V7a1 1 0 0 0-2 0M6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </>}
        </>

    )
}

export default ShowNotesPage