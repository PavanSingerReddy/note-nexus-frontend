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


  const navigate = useNavigate();


  const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


  const { filteredNotes, notes, setSortedNotes, setSortedFilteredNotes, Debouncer, searchNotes, showNoteDeleteModal, setShowNoteDeleteModal, searchTerm } = useContext(NotesContext)


  const [selectedNote, setSelectedNote] = useState(null);


  const [isSearchTermActive, setIsSearchTermActive] = useState(false)


  const handleNoteClick = (noteItem, event) => {

    event.stopPropagation()

    setSelectedNote(noteItem);

    setShowNoteDeleteModal(true);
  };



  const [pageNum, setPageNum] = useState(0)


  const {
    isLoading,
    isError,
    error,
    results,
    hasNextPage
  } = useNotes(pageNum)


  const intersectionObserver = useRef()


  const lastNoteRef = useCallback(note => {

    if (isLoading) return

    if (intersectionObserver.current) intersectionObserver.current.disconnect()

    intersectionObserver.current = new IntersectionObserver(note => {

      if (note[0].isIntersecting && hasNextPage && !isSearchTermActive) {

        setPageNum(prev => prev + 1)
      }
    })


    if (note) intersectionObserver.current.observe(note)
  }, [isLoading, hasNextPage])



  useEffect(() => {

    setSortedNotes(results)

  }, [results])


  useEffect(() => {


    if (isError) {


      setShowAlert(true)


      setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
    }

  }, [isError, error])







  const debouncedSearchNotes = useRef(new Debouncer(searchNotes, 300));





  useEffect(() => {


    if (searchTerm.trim() === "") {
      debouncedSearchNotes.current.cancel();
      setSortedFilteredNotes(notes);
      setIsSearchTermActive(false)
    } else {



      debouncedSearchNotes.current.debounced(searchTerm).then(data => setSortedFilteredNotes(data));

      setIsSearchTermActive(true)
    }
  }, [searchTerm, notes]);



  return (
    <>


      {filteredNotes.length === 0 ? <div className='text-xl flex h-[75vh] justify-center items-center'>No Notes Found</div> :

        <>

          <div className="grid grid-cols-2 gap-4 m-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-[minmax(0,_20vh)] grid-flow-dense">

            {filteredNotes.map((noteItem, index) => {





              if (results.length === index + 1 && !isSearchTermActive) {
                return <Note ref={lastNoteRef} key={noteItem.noteId} noteItem={noteItem} index={index} onClick={(event) =>
                  handleNoteClick(noteItem, event)} />
              }

              return <Note key={noteItem.noteId} noteItem={noteItem} index={index} onClick={(event) =>
                handleNoteClick(noteItem, event)} />
            })}
          </div>

          {isLoading ? <PaginationLoader /> : <></>}


          {showNoteDeleteModal && <DeleteConfirmationModel noteItem={selectedNote} />}
        </>
      }
    </>
  )
}

export default Notes








