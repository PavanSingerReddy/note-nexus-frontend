import React, { useContext, useEffect, useRef, useState } from 'react'
import Note from './Note'
import { useNavigate } from 'react-router-dom'
import NotesContext from '../context/NotesContext';
import DeleteConfirmationModel from './Modals/DeleteConfirmationModel';
import useNotes from '../hooks/useNotes';
import { useCallback } from 'react';
import PaginationLoader from './Loaders/PaginationLoader';
import AlertContext from '../context/AlertContext';

const Notes = () => {

  // use navigate is used for routing in to different webpages in the react router
  const navigate = useNavigate();

  // used for getting the states from the notes context 
  const { filteredNotes, notes, setSortedNotes, setSortedFilteredNotes, Debouncer, searchNotes, showNoteDeleteModal, setShowNoteDeleteModal, searchTerm } = useContext(NotesContext)

  // setting the state of the selectedNote
  const [selectedNote, setSelectedNote] = useState(null);

  // This state helps us to determine if the searchTerm state has any characters and if the user is trying to search anything.we will configure it in the below useEffect hook with searchTerm and notes as dependencies
  const [isSearchTermActive, setIsSearchTermActive] = useState(false)

  // function which handles the delete functionality of a note when a user clicks on the delete note button on a note we pass this function as a prop to every single note
  const handleNoteClick = (noteItem, event) => {
    // stops the event bubling from the note component as note component also has the onclick event attached to it
    event.stopPropagation()
    // sets the selected note item for delete so that our delete modal can get the selected note item and send request to the delete the selected note item
    setSelectedNote(noteItem);
    // shows the delete modal
    setShowNoteDeleteModal(true);
  };


  // setting the state for page number incrementing and also setting the initial page number to zero so that we could fetch the first page of the notes as in the backend we are using spring boot which counts pages starting from zero.The page number increments as user scrolls and reaches at the end of the page
  const [pageNum, setPageNum] = useState(0)

  // extracting the returned values from the useNotes or importing different states from the useNotes custom hook by giving the pageNum state.
  const {
    isLoading,
    isError,
    error,
    results,
    hasNextPage
  } = useNotes(pageNum)

  // here we are creating a ref using the useRef hook. This ref will be used to store the Intersection Observer instance.we can store the object of Intersection Observer in this intersectionObserver.current property
  const intersectionObserver = useRef()
  // here we are defining a callback function that will be attached to the ref of the last note element.And The useCallback hook is used to return a memoized version of the callback so that this function is not created for every render it only get's created when the isLoading or hasNextPage states changes.This useCallback is used only for performance improvement if we want we can ignore it too.
  // here note refers to the element to which this function or callback is attached as a ref
  const lastNoteRef = useCallback(note => {
    // If notes are currently being loaded (isLoading is true), the callback immediately returns and does nothing.
    if (isLoading) return
    // If an Intersection Observer instance already exists, it disconnects the observer. This stops the observer from watching all of its target elements for visibility changes.so this line of code removes the intersection observer from the previous last note
    if (intersectionObserver.current) intersectionObserver.current.disconnect()
    // This line creates a new Intersection Observer instance and assigns it to intersectionObserver.current.
    intersectionObserver.current = new IntersectionObserver(note => {
      // Inside the Intersection Observer callback, it checks if the last note is intersecting with the viewport and if there is a next page of notes and also if the search Term is active or not it only works if the search term is not active.search term not active means user is not searching for anything.
      if (note[0].isIntersecting && hasNextPage && !isSearchTermActive) {
        // This line increments the page number by 1, which triggers a network request for the next page of notes.
        setPageNum(prev => prev + 1)
      }
    })

    // If the note element exists, the observer starts observing it for visibility changes.
    if (note) intersectionObserver.current.observe(note)
  }, [isLoading, hasNextPage])


  // this useEffect checks for results state and if the results state updates with that it also updates the notes state so that we can get more notes when we are scrolling from infinite scroll
  useEffect(() => {

    setSortedNotes(results)

  }, [results])


  // if(isError) return <p>Error : {error.message}</p>

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
    // If it is, cancel any ongoing debounced search and set the sorted and filtered notes to the original notes.And also set the isSearchTermActive to false as we are not searching for anything
    if (searchTerm.trim() === "") {
      debouncedSearchNotes.current.cancel();
      setSortedFilteredNotes(notes);
      setIsSearchTermActive(false)
    } else {
      // If the search term is not empty, start a debounced search.
      // debouncedSearchNotes.current.debounced(searchTerm) returns a promise that resolves with the search results.
      // When the promise resolves, set the sorted and filtered notes to the search results.
      debouncedSearchNotes.current.debounced(searchTerm).then(data => setSortedFilteredNotes(data));
      // And also set the isSearchTermActive to true as we are searching for some notes
      setIsSearchTermActive(true)
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
              // returning each individual note component and we pass the index of the array as a key and noteItem as prop so that the note component can populate with the user note details and pass the index for calculating the grid row-span and col-span onClick event handler which is used for making the grid tiles for notes

              // here we should not use key as index instead we should use unique key that is given by the noteItem state when it made a network request for fetching notes

              // Inside the map callback, we check if the current note is the last note in the results array. If it is, it returns a Note component with the lastNoteRef callback attached to its ref prop. If it’s not the last note, it returns a Note component without a ref
              if (results.length === index + 1 && !isSearchTermActive) {
                return <Note ref={lastNoteRef} key={noteItem.noteId} noteItem={noteItem} index={index} onClick={(event) =>
                  handleNoteClick(noteItem, event)} />
              }

              return <Note key={noteItem.noteId} noteItem={noteItem} index={index} onClick={(event) =>
                handleNoteClick(noteItem, event)} />
            })}
          </div>

          {isLoading ? <PaginationLoader /> : <></>}

          {/* the note deleted modal state is set to true when we click on the delete button on the note component so we get the delete modal with the selected note details to delete as we pass the selected note state  */}
          {showNoteDeleteModal && <DeleteConfirmationModel noteItem={selectedNote} />}
        </>
      }
    </>
  )
}

export default Notes


// NOTE : In React, ref is commonly used to get direct access to a DOM element or an instance of a component. However, in our case, we are using ref in a slightly different way. Instead of using ref to store a reference to a DOM node, we are using it to attach a function (lastNoteRef) to a DOM node (the last note). This function is then executed whenever this DOM node’s ref is accessed during rendering.

// The useCallback hook is used here to ensure that the lastNoteRef function doesn’t change on every render. Without useCallback, a new lastNoteRef function would be created on every render, causing unnecessary re-renders of your Note components, as each Note would receive a new ref prop on every render.

// So, in our case, lastNoteRef is a function that’s attached to the ref of the last note. When React sees this, it will call this function with the DOM node as its argument, which allows us to directly observe this DOM node with the Intersection Observer in our lastNoteRef function.

// This is a more advanced use of ref, but it’s perfectly valid and is part of React’s flexibility. It allows us to observe the last note element directly as soon as it’s rendered to the DOM, which is exactly what we need for implementing the infinite scroll feature. So yes, it will work. This pattern is sometimes referred to as “callback refs” in React.