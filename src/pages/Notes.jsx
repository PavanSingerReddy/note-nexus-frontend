import React, { useContext, useEffect, useRef, useState } from 'react'
import Note from './Note'
import { useNavigate } from 'react-router-dom'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import NotesContext from '../context/NotesContext';
import DeleteConfirmationModel from './Modals/DeleteConfirmationModel';

const Notes = () => {

  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();

  // used for getting the states from the notes context 
  const { filteredNotes, notes, setSortedNotes, setSortedFilteredNotes, Debouncer, searchNotes, showNoteDeleteModal, setShowNoteDeleteModal, searchTerm } = useContext(NotesContext)

  // setting the state of the selectedNote
  const [selectedNote, setSelectedNote] = useState(null);

  // function which handles the delete functionality of a note when a user clicks on the delete note button on a note we pass this function as a prop to every single note
  const handleNoteClick = (noteItem, event) => {
    // stops the event bubling from the note component as note component also has the onclick event attached to it
    event.stopPropagation()
    // sets the selected note item for delete so that our delete modal can get the selected note item and send request to the delete the selected note item
    setSelectedNote(noteItem);
    // shows the delete modal
    setShowNoteDeleteModal(true);
  };

  // use effect which is used to fetch the user's note details when the user first loads the Home page after signing in
  useEffect(() => {
    // function which fetches the notes of the user
    const fetchData = async () => {
      // try catch block for handling the errors while making network request 
      try {
        // url for getting the notes of the logged in user 
        // importing User Notes url using the environment variables in the root directory of this application
        const getUserNotesUrl = import.meta.env.VITE_GET_USER_NOTES_URL
        // network request for getting the notes of the user
        const response = await httpRequestAxiosQueueUtility.authenticatedGet(getUserNotesUrl);
        // sort the notes using the setSortedNotes method which comes from the NotesContext.After setting the notes using setSorted notes function the filtered notes get's recalculated as the filtered notes uses the Notes state
        setSortedNotes(response.data)

      } catch (error) {
        // if any error happens while making the network request to fetch the users then we print the error 
        console.error("got error while fetching the user notes");
        console.log(error)

        // making another request which logs out the user by removing the cookies related to the user from the backend
        // using try catch to handle network error request 
        try {
          // making the logout request to the backend
          // importing log out Url using the environment variables in the root directory of this application
          const logoutUrl = import.meta.env.VITE_LOGOUT_URL
          await httpRequestAxiosQueueUtility.authenticatedPost(logoutUrl)
        } catch (error) {
          // if any error occurs while making the network request to logout we print the error
          console.error("error doing logout")
        }
        // if any error occurs while fetching the user notes we navigate to the login page after removing the cookies of the user by requesting to the backend api using logout url
        navigate("/login");
      }
    }

    //async function which fetches the user notes 
    fetchData();
  }, [])


  // Debounced Search Function: Here we create a debounced version of our search function using the Debouncer class we defined in the NotesContext. This new function will wait for 300 milliseconds after the last call before executing. If it is called again within this time, it will reset the timer.
  // Create a ref object that holds an instance of the Debouncer class.
  // The Debouncer class is initialized with the searchNotes function and a delay of 300 milliseconds.
  // useRef ensures that the same Debouncer instance is used across all renders of the component.
  const debouncedSearchNotes = useRef(new Debouncer(searchNotes, 300));

  // useEffect is a React hook that runs side-effects in function components.
  // The function passed to useEffect will run after the render is committed to the screen.
  // The second argument is an array of dependencies for this effect. 
  // The effect will only run when one of these dependencies has changed since the last render.
  useEffect(() => {
    // Check if the search term is empty.
    // If it is, cancel any ongoing debounced search and set the sorted and filtered notes to the original notes.
    if (searchTerm.trim() === "") {
      debouncedSearchNotes.current.cancel();
      setSortedFilteredNotes(notes);
    } else {
      // If the search term is not empty, start a debounced search.
      // debouncedSearchNotes.current.debounced(searchTerm) returns a promise that resolves with the search results.
      // When the promise resolves, set the sorted and filtered notes to the search results.
      debouncedSearchNotes.current.debounced(searchTerm).then(data => setSortedFilteredNotes(data));
    }
  }, [searchTerm, notes]); // The effect depends on searchTerm and notes. It will run again whenever one of these values changes.



  return (
    <>
      {/* filteredNotes is a variable which contains the notes based on the search term entered and is calculated using the notes state in the NotesContext */}
      {/* if the filtered notes array length is zero then we return the No notes found div else we return the div containing the notes */}
      {filteredNotes.length === 0 ? <div className='text-xl flex h-[75vh] justify-center items-center'>No Notes Found</div> :

        <>
          {/* div containing the notes */}
          <div className="grid grid-cols-2 gap-4 m-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-[minmax(0,_20vh)] grid-flow-dense">
            {/* iterating over filtered notes to show the note details these filterd notes is an array which is based upon our search term you can see it's implementation in the notes context */}
            {filteredNotes.map((noteItem, index) => {
              // returning each individual note component and we pass the index of the array as a key and noteItem as prop so that the note component can populate with the user note details and pass the index for calculating the grid row-span and col-span onClick event handler which 
              return <Note key={index} noteItem={noteItem} index={index} onClick={(event) =>
                handleNoteClick(noteItem, event)} />
            })}
          </div>
          {/* the note deleted modal state is set to true when we click on the delete button on the note component so we get the delete modal with the selected note details to delete as we pass the selected note state  */}
          {showNoteDeleteModal && <DeleteConfirmationModel noteItem={selectedNote} />}
        </>
      }
    </>
  )
}

export default Notes