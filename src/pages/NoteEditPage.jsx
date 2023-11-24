import React, { useContext, useEffect, useState } from 'react'
import BackButton from './buttons/BackButton';
import SaveButton from './buttons/SaveButton';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import LoaderContext from '../context/LoaderContext';
import FullPageLoader from './Loaders/FullPageLoader';
import NotesContext from '../context/NotesContext';

const NoteEditPage = () => {

    // use navigate hook which is used for routing in the react router dom
    const navigate = useNavigate()

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // used to set the the loading bar when any body comes to the Note Edit Page 
    useEffect(() => {

        // set's the loading bar to 80 percent when we route to this page
        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))

    }, [])


    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while authenticating the user 
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // this useEffect is used to check if the user is authenticated or not and it activates the loading page while the user is getting authenticated and after the authentication the loading page is set to false
    useEffect(() => {
        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {

            // setting the isFullPageLoaderActive to true so that we can see the full loading page
            setIsFullPageLoaderActive(true);
            // checking if the user is authenticated or not
            try {
                await httpRequestAxiosQueueUtility.isAuthenticated()

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

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)
            } catch (error) {
                // printing error if the user is not authenticated
                console.error("got error while authenticating the user");
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
        // calling the exec() function to perform our user authentication process
        exec();

    }, [])



    // use location is used to access the state which is passed in the react router dom using the useNavigate() hook
    const location = useLocation()
    const note = location.state.noteItem;

    // using setNoteData to populate the values of the note title and note content of the selected note which the user want to edit.The note state is passed using useNavigate() hook and accessed by using the useLocation() hook
    const [noteData, setNoteData] = useState(note)

    // this onchange event handler updates the value of the noteData state with the edited data
    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setNoteData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // onClickHandler which is used to handle the edited note and update the edited note in our backend 
    const onClickHandler = async (event) => {
        event.preventDefault()
        // increasing the progress bar value
        setProgressBar((prevState) => ({
            show: true,
            width: 25
        }))
        // url to update the note using it's note id
        // importing edit note url using the environment variables in the root directory of this application
        const editNoteUrl = `${import.meta.env.VITE_Edit_NOTE_URL}${noteData.noteId}`

        try {
            // increasing the progress bar value
            setProgressBar((prevState) => ({
                show: true,
                width: 40
            }))
            await httpRequestAxiosQueueUtility.authenticatedPut(editNoteUrl, noteData)
            // increasing the progress bar value
            setProgressBar((prevState) => ({
                show: true,
                width: 75
            }))
        } catch (error) {
            // if any error occurs while edited note submission change the progress bar value to zero and hiding the progress bar
            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))
        }
        // after editing the note we are navigating to the home page of the user
        navigate("/")
    }

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

                    <div className='relative'>
                        <div className="relative top-1">
                            <BackButton onClickBackButtonHandler={onClickBackButtonHandler} /></div>
                        <div className='absolute right-1 top-1'>
                            <SaveButton onClickHandler={onClickHandler} />
                        </div>
                    </div>


                    {/* Note Heading */}

                    <div className="m-3">
                        <label htmlFor="Note Heading" className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                            Note Heading
                        </label>
                        <div className='relative'>
                            <input
                                onChange={onchangeHandler}
                                type='text'
                                id="Note Heading"
                                autoFocus
                                placeholder='Note Heading'
                                className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                name='title'
                                value={noteData.title}
                            />
                            <span className='absolute top-1/2 left-4 -translate-y-1/2'>
                                <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity={0.8}>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.56622 3.23223C2.03506 2.76339 2.67094 2.5 3.33398 2.5H9.16732C9.62755 2.5 10.0006 2.8731 10.0006 3.33333C10.0006 3.79357 9.62755 4.16667 9.16732 4.16667H3.33398C3.11297 4.16667 2.90101 4.25446 2.74473 4.41074C2.58845 4.56702 2.50065 4.77899 2.50065 5V16.6667C2.50065 16.8877 2.58845 17.0996 2.74473 17.2559C2.90101 17.4122 3.11297 17.5 3.33398 17.5H15.0006C15.2217 17.5 15.4336 17.4122 15.5899 17.2559C15.7462 17.0996 15.834 16.8877 15.834 16.6667V10.8333C15.834 10.3731 16.2071 10 16.6673 10C17.1276 10 17.5006 10.3731 17.5006 10.8333V16.6667C17.5006 17.3297 17.2373 17.9656 16.7684 18.4344C16.2996 18.9033 15.6637 19.1667 15.0006 19.1667H3.33398C2.67094 19.1667 2.03506 18.9033 1.56622 18.4344C1.09738 17.9656 0.833984 17.3297 0.833984 16.6667V5C0.833984 4.33696 1.09738 3.70107 1.56622 3.23223Z"
                                            fill="#9CA3AF"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.6673 2.39909C16.4195 2.39909 16.1818 2.49754 16.0066 2.67278L8.25314 10.4262L7.81264 12.1882L9.57463 11.7477L17.3281 3.99427C17.5033 3.81903 17.6018 3.58135 17.6018 3.33352C17.6018 3.0857 17.5033 2.84802 17.3281 2.67278C17.1528 2.49754 16.9152 2.39909 16.6673 2.39909ZM14.8281 1.49427C15.3159 1.00647 15.9775 0.732422 16.6673 0.732422C17.3572 0.732422 18.0188 1.00647 18.5066 1.49427C18.9944 1.98207 19.2684 2.64367 19.2684 3.33352C19.2684 4.02338 18.9944 4.68498 18.5066 5.17278L10.5899 13.0894C10.4831 13.1962 10.3493 13.272 10.2028 13.3086L6.86945 14.142C6.58547 14.213 6.28506 14.1298 6.07808 13.9228C5.8711 13.7158 5.78789 13.4154 5.85888 13.1314L6.69222 9.79808C6.72885 9.65155 6.80461 9.51773 6.91141 9.41093L14.8281 1.49427Z"
                                            fill="#9CA3AF"
                                        />
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Note content */}

                    <div className="m-3">
                        <label htmlFor="Note Content" className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                            Note Content
                        </label>
                        <div className='relative'>
                            <textarea
                                type='email'
                                rows='10'
                                placeholder="Note Content"
                                name='content'
                                onChange={onchangeHandler}
                                id="Note Content"
                                value={noteData.content}
                                className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                            />
                            <span className='absolute top-[18px] left-4'>
                                <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity={0.8}>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.56622 3.23223C2.03506 2.76339 2.67094 2.5 3.33398 2.5H9.16732C9.62755 2.5 10.0006 2.8731 10.0006 3.33333C10.0006 3.79357 9.62755 4.16667 9.16732 4.16667H3.33398C3.11297 4.16667 2.90101 4.25446 2.74473 4.41074C2.58845 4.56702 2.50065 4.77899 2.50065 5V16.6667C2.50065 16.8877 2.58845 17.0996 2.74473 17.2559C2.90101 17.4122 3.11297 17.5 3.33398 17.5H15.0006C15.2217 17.5 15.4336 17.4122 15.5899 17.2559C15.7462 17.0996 15.834 16.8877 15.834 16.6667V10.8333C15.834 10.3731 16.2071 10 16.6673 10C17.1276 10 17.5006 10.3731 17.5006 10.8333V16.6667C17.5006 17.3297 17.2373 17.9656 16.7684 18.4344C16.2996 18.9033 15.6637 19.1667 15.0006 19.1667H3.33398C2.67094 19.1667 2.03506 18.9033 1.56622 18.4344C1.09738 17.9656 0.833984 17.3297 0.833984 16.6667V5C0.833984 4.33696 1.09738 3.70107 1.56622 3.23223Z"
                                            fill="#9CA3AF"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.6673 2.39909C16.4195 2.39909 16.1818 2.49754 16.0066 2.67278L8.25314 10.4262L7.81264 12.1882L9.57463 11.7477L17.3281 3.99427C17.5033 3.81903 17.6018 3.58135 17.6018 3.33352C17.6018 3.0857 17.5033 2.84802 17.3281 2.67278C17.1528 2.49754 16.9152 2.39909 16.6673 2.39909ZM14.8281 1.49427C15.3159 1.00647 15.9775 0.732422 16.6673 0.732422C17.3572 0.732422 18.0188 1.00647 18.5066 1.49427C18.9944 1.98207 19.2684 2.64367 19.2684 3.33352C19.2684 4.02338 18.9944 4.68498 18.5066 5.17278L10.5899 13.0894C10.4831 13.1962 10.3493 13.272 10.2028 13.3086L6.86945 14.142C6.58547 14.213 6.28506 14.1298 6.07808 13.9228C5.8711 13.7158 5.78789 13.4154 5.85888 13.1314L6.69222 9.79808C6.72885 9.65155 6.80461 9.51773 6.91141 9.41093L14.8281 1.49427Z"
                                            fill="#9CA3AF"
                                        />
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>

                </>
            }
        </>
    )
}

export default NoteEditPage