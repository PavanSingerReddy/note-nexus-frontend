import React, { useState } from 'react'
import NotesContext from './NotesContext'

// Notes Context provider holds all the states of the Notes and we can import this states using the Notes context
const NotesContextProvider = ({children}) => {

  // notes state holds all the notes of the user
  const [notes, setNotes] = useState([])
  // showNoteDeleteModal sets the state to true or false based on this noteDeleteModal is shown
  const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false)
  // searchTerm state holds the terms which the user types to search for a note
  const [searchTerm, setSearchTerm] = useState("")
  // progress bar holds the state of the progress bar whether the progress bar should be shown using the show variable and the progress percentage using width variable
  const [progressBar, setProgressBar] = useState({
    show:true,
    width:0
  })

  // filteredNotes which filters the notes state based on the search term and stores them in the filteredNotes variable which changes dynamically when the notes state changes as the filtered notes variable depends on the notes state and searchTerm state
  const filteredNotes = searchTerm.trim() === "" ?notes:notes.filter((note)=>(
    // filteredNotes variable checks both the note title and note context for searching with the search term
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  // This setSortedNotes is used to sort the notes based on the note updated date from newest note to the starting to the oldest note to the ending
  const setSortedNotes = (notes)=>{
    // creates a new array because sort() function mutates the original array. sort() function then sorts the array using the comparator function in descending order 
    const sortedNotes = [...notes].sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt))
    // set's the new sorted notes as the new notes state
    setNotes(sortedNotes);
  }

  return (
    // The values we provide in the Notes context provider will be accessible by the child components of the Notes context provider 
    <NotesContext.Provider value={{notes,searchTerm,setSearchTerm,filteredNotes,setSortedNotes,showNoteDeleteModal,setShowNoteDeleteModal,progressBar,setProgressBar}} >
        {children}
    </NotesContext.Provider>
  )
}

export default NotesContextProvider