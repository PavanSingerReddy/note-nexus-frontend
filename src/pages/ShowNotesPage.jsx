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


    const navigate = useNavigate()


    const { setProgressBar, setSortedFilteredNotes } = useContext(NotesContext)


    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


    useEffect(() => {


        setProgressBar((prevState) => ({
            show: true,
            width: 80
        }))


    }, [])


    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);


    useEffect(() => {


        const controller = new AbortController()


        const { signal } = controller


        const exec = async () => {


            setIsFullPageLoaderActive(true);

            try {
                const response = await httpRequestAxiosQueueUtility.isAuthenticated({ signal })


                if (import.meta.env.VITE_CANCEL_NETWORK_REQUEST_STRING.localeCompare(response) === 0) {
                    return
                }


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

                setAlertErrorMessage("got error while authenticating the user");

                try {
                    const logoutUrl = import.meta.env.VITE_LOGOUT_URL
                    await httpRequestAxiosQueueUtility.post(logoutUrl)
                } catch (error) {

                    setShowAlert(true)

                    setAlertErrorMessage("got error while authenticating the user and got error doing logout too")
                }

                setIsFullPageLoaderActive(false)


                setSortedFilteredNotes([]);
                navigate("/login");
            }
        }

        exec();


        return () => {
            controller.abort()
        }

    }, [])




    const location = useLocation()
    const note = location.state.noteItem;


    const onClickBackButtonHandler = (event) => {
        event.preventDefault()

        setProgressBar((prevState) => ({
            show: true,
            width: 50
        }))
        navigate("/")
    }

    return (
        <>

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