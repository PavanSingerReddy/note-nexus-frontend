import React, { useContext, useState } from 'react'
import NotesContext from './NotesContext'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility'
import AlertContext from './AlertContext'

// Notes Context provider holds all the states of the Notes and we can import this states using the Notes context
const NotesContextProvider = ({ children }) => {

  // notes state holds all the notes of the user
  const [notes, setNotes] = useState([])
  // showNoteDeleteModal sets the state to true or false based on this noteDeleteModal is shown
  const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false)

  // getting setShowAlert and setAlertErrorMessage from AlertContext
  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

  // searchTerm state holds the terms which the user types to search for a note
  const [searchTerm, setSearchTerm] = useState("")
  // progress bar holds the state of the progress bar whether the progress bar should be shown using the show variable and the progress percentage using width variable
  const [progressBar, setProgressBar] = useState({
    show: true,
    width: 0
  })

  const [filteredNotes, setFilteredNotes] = useState([]);

  // Debounce Function: The purpose of the debounce function is to limit the number of times a particular function can be called. It does this by introducing a delay. If the function is called again before the delay has passed, the timer is reset. This is useful in our case because we don’t want to call the search API every time the user presses a key. Instead, we want to wait until the user has stopped typing.

  // below debounce version is a more generalized way of writing debounce function it can be used in any other code base not only on this current code base
  // Define a class named Debouncer
  class Debouncer {
    // The constructor method is a special method for creating and initializing an object created with a class.
    // It takes two parameters: a function to debounce and a delay in milliseconds.
    constructor(func, delay) {
      // Store the function and delay as properties of the object.
      this.func = func;
      this.delay = delay;
      // Initialize a property for the debounce timer. This will be used to hold the timeout ID of the debounced function.
      this.debounceTimer = null;
    }

    // Define a method named debounced that takes any number of arguments.
    // This method will be used to call the debounced function.
    debounced(...args) {
      // Clear any existing timeout. This cancels any previous calls to the debounced function that haven't executed yet.
      clearTimeout(this.debounceTimer);
      // Return a new promise. This allows the caller to wait for the debounced function to execute.
      return new Promise((resolve) => {
        // Set a timeout to call the debounced function after the specified delay.
        // When the debounced function is called, resolve the promise with its return value.
        // The spread syntax (...) is used to pass all arguments to the function.
        this.debounceTimer = setTimeout(() => resolve(this.func(...args)), this.delay);
      });
    }

    // Define a method named cancel to cancel any ongoing debounce.
    cancel() {
      // Clear the timeout. This cancels any calls to the debounced function that haven't executed yet.
      clearTimeout(this.debounceTimer);
    }
  }





  // Search Function: This function is used to call your search API. It takes a search term as an argument, makes a request to your API, and returns the result.
  const searchNotes = async (searchTerm) => {
    try {
      const response = await httpRequestAxiosQueueUtility.authenticatedGet(`${import.meta.env.VITE_SEARCH_URL}${searchTerm}`);
      const data = await response.data
      return data;

    } catch (error) {
      // setting the show Alert to true so that we can see the alert
      setShowAlert(true)
      // setting the alert message based on the error response
      setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
    }
  }


  // This setSortedNotes is used to sort the notes based on the note updated date from newest note to the starting to the oldest note to the ending
  const setSortedNotes = (notes) => {
    // creates a new array because sort() function mutates the original array. sort() function then sorts the array using the comparator function in descending order 
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    // set's the new sorted notes as the new notes state
    setNotes(sortedNotes);
  }

  // This setSortedFilteredNotes is used to sort the notes based on the note updated date from newest note to the starting to the oldest note to the ending
  const setSortedFilteredNotes = (notes) => {
    // creates a new array because sort() function mutates the original array. sort() function then sorts the array using the comparator function in descending order 
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    // set's the new sorted notes as the new filteredNotes state
    setFilteredNotes(sortedNotes);
  }

  return (
    // The values we provide in the Notes context provider will be accessible by the child components of the Notes context provider 
    <NotesContext.Provider value={{ notes, searchTerm, setSearchTerm, filteredNotes, setSortedNotes, setSortedFilteredNotes, showNoteDeleteModal, setShowNoteDeleteModal, progressBar, setProgressBar, Debouncer, searchNotes }} >
      {children}
    </NotesContext.Provider>
  )
}

export default NotesContextProvider