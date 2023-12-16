import { useContext, useEffect } from 'react';
import NotesContext from '../context/NotesContext';
import Navbar from './Navbar';
import Notes from './Notes';
import SearchBar from './SearchBar';
import AddNoteButton from './buttons/AddNoteButton';
import IsAuthenticatedPage from '../HOC(Higher-Order Component)/IsAuthenticatedPage';

const HomePage = () => {

  // used for setting the progress bar
  const { setProgressBar } = useContext(NotesContext)


  // used to set the the progress bar when any body comes to the home page of the user 
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

      {/* making navbar and search bar Components sticky so that they stick to the top even and does not scroll out when we scroll the content*/}
      <div className="sticky top-0 z-10">
        <Navbar />
        <SearchBar />
      </div>

      {/* Notes component which is used to show all the notes of the particular user */}
      <Notes />

      {/* Add note button component which contains the button to add new notes when pressed routes to the AddNotePage component */}
      <AddNoteButton />

    </>
  )
}


// we are exporting the value returned by this "IsAuthenticatedPage(HomePage)" HOC(HIGHER-ORDER-FUNCTION) function This function returns a new function which will encapsulate this HomePage component in it and also have the capability of authenticating the user before rendering this HomePage
export default IsAuthenticatedPage(HomePage)