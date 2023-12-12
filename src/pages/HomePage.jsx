import { useContext, useEffect } from 'react';
import NotesContext from '../context/NotesContext';
import Navbar from './Navbar';
import Notes from './Notes';
import SearchBar from './SearchBar';
import AddNoteButton from './buttons/AddNoteButton';
import FullPageLoader from './Loaders/FullPageLoader';
import LoaderContext from '../context/LoaderContext';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../context/AlertContext';

const HomePage = () => {


  const { setProgressBar, setSortedFilteredNotes } = useContext(NotesContext)


  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)



  useEffect(() => {


    setProgressBar((prevState) => ({
      show: true,
      width: 80
    }))

  }, [])


  const navigate = useNavigate()


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



  return (
    <>


      {isFullPageLoaderActive ? <FullPageLoader /> :

        <>


          <div className="sticky top-0 z-10">
            <Navbar />
            <SearchBar />
          </div>


          <Notes />


          <AddNoteButton />

        </>}


    </>
  )
}

export default HomePage