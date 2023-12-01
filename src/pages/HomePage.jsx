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

  // used for setting the progress bar
  const { setProgressBar } = useContext(NotesContext)

  // getting setShowAlert and setAlertErrorMessage from AlertContext
  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


  // used to set the the progress bar when any body comes to the home page of the user 
  useEffect(() => {

    // set's the progress bar to 80 percent when we route to this page
    setProgressBar((prevState) => ({
      show: true,
      width: 80
    }))

  }, [])

  // navigate hook which is used to navigate to the different routes in the react router dom
  const navigate = useNavigate()

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
        // setting the alert message
        setAlertErrorMessage("got error while authenticating the user");
        // logging out the user which clears all the user's cookies
        try {
          const logoutUrl = import.meta.env.VITE_LOGOUT_URL
          await httpRequestAxiosQueueUtility.authenticatedPost(logoutUrl)
        } catch (error) {
          // if any error occurs while logging out we print the error

          // setting the show Alert to true so that we can see the alert
          setShowAlert(true)
          // setting the alert message
          setAlertErrorMessage("error doing logout")
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



  return (
    <>

      {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
      {isFullPageLoaderActive ? <FullPageLoader /> :

        <>

          {/* making navbar and search bar Components sticky so that they stick to the top even and does not scroll out when we scroll the content*/}
          <div className="sticky top-0 z-10">
            <Navbar />
            <SearchBar />
          </div>

          {/* Notes component which is used to show all the notes of the particular user */}
          <Notes />

          {/* Add note button component which contains the button to add new notes when pressed routes to the AddNotePage component */}
          <AddNoteButton />

        </>}


    </>
  )
}

export default HomePage