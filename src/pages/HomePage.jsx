import { useContext, useEffect } from 'react';
import NotesContext from '../context/NotesContext';
import Navbar from './Navbar';
import Notes from './Notes';
import SearchBar from './SearchBar';
import AddNoteButton from './buttons/AddNoteButton';

const HomePage = () => {

  // used for setting the progress bar
  const { setProgressBar } = useContext(NotesContext)

  // used to set the the loading bar when any body comes to the home page of the user 
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

export default HomePage