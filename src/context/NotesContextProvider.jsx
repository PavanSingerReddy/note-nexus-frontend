import React, { useContext, useState } from 'react'
import NotesContext from './NotesContext'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility'
import AlertContext from './AlertContext'


const NotesContextProvider = ({ children }) => {


  const [notes, setNotes] = useState([])

  const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false)


  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


  const [searchTerm, setSearchTerm] = useState("")

  const [progressBar, setProgressBar] = useState({
    show: true,
    width: 0
  })

  const [filteredNotes, setFilteredNotes] = useState([]);





  class Debouncer {


    constructor(func, delay) {

      this.func = func;
      this.delay = delay;

      this.debounceTimer = null;
    }



    debounced(...args) {

      clearTimeout(this.debounceTimer);

      return new Promise((resolve) => {



        this.debounceTimer = setTimeout(() => resolve(this.func(...args)), this.delay);
      });
    }


    cancel() {

      clearTimeout(this.debounceTimer);
    }
  }






  const searchNotes = async (searchTerm) => {
    try {
      const response = await httpRequestAxiosQueueUtility.get(`${import.meta.env.VITE_SEARCH_URL}${searchTerm}`);
      const data = await response.data
      return data;

    } catch (error) {

      setShowAlert(true)

      setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
    }
  }



  const setSortedNotes = (notes) => {

    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    setNotes(sortedNotes);
  }


  const setSortedFilteredNotes = (notes) => {

    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    setFilteredNotes(sortedNotes);
  }

  return (

    <NotesContext.Provider value={{ notes, searchTerm, setSearchTerm, filteredNotes, setSortedNotes, setSortedFilteredNotes, showNoteDeleteModal, setShowNoteDeleteModal, progressBar, setProgressBar, Debouncer, searchNotes }} >
      {children}
    </NotesContext.Provider>
  )
}

export default NotesContextProvider