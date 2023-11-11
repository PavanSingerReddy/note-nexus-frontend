import React, { useContext } from 'react'
import NotesContext from '../../context/NotesContext';
import httpRequestAxiosQueueUtility from '../../utils/HttpRequestAxiosQueueUtility';

// this delete note modal takes the note item as a prop which is used in case if we want to delete that note as note item contains details about the selected note 
const DeleteConfirmationModel = ({noteItem}) => {

    // uses the setShowDeleteModal function which set's the state of the showDeleteModal and uses the notes state and also uses the setSortedNotes which set's the notes state after sorting it according to date
    const {setShowNoteDeleteModal,notes,setSortedNotes} = useContext(NotesContext)

    // function which is used to close the delete modal 
    const onClickHandler = (event)=>{
        event.preventDefault()
        if(event.target.id==="deleteModalBackground" || event.target.id === "closeModal") setShowNoteDeleteModal(false)

    }

    // async function which deletes the notes when the user presses yes to delete the selected note
    const DeleteNoteHandler = async(event)=>{
        event.preventDefault()
        // making network request to delete the selected user note
        const deleteNoteUrl = `http://localhost:8080/api/notes/delete/${noteItem.noteId}`
        await httpRequestAxiosQueueUtility.authenticatedDelete(deleteNoteUrl)
        // removes the note item from the notes after it get's successfully deleted and assigns it to a variable
        const newNotes = notes.filter(note=> note.noteId !== noteItem.noteId )
        // set's the notes state to the updated new notes which removes the deleted note
        setSortedNotes(newNotes)
        // closing the delete note modal after successful deletion
        setShowNoteDeleteModal(false)
    }

  return (
    // if the user presses on the background div of the note delete modal then we trigger the onClickHandler function which close the delete modal
    // inset-0 set's the top-0 right-0 left-0 bottom-0 which spans the div across the whole page as the position is fixed 
    <div id='deleteModalBackground' onClick={onClickHandler} className='z-10 fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center'>
        {/* the element which contains the actual note delete modal contents */}
        <div className="bg-zinc-100 p-6 rounded-lg">
            <div>
                <p className='italic font-extrabold m-4 text-xl'>Are you sure you want to delete the below Note ?</p>
                <span className='font-bold ml-4 m-1'>Note Title : </span> <span className='text-teal-900 font-mono'>{noteItem.title}</span>
            </div>
            <div className='flex justify-around m-5'>
                {/* button which closes the note delete modal with out deleting the note */}
                <button id='closeModal' onClick={onClickHandler} className='bg-green-400 p-2 rounded-lg hover:bg-green-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>No</button>
                {/* button which closes the note delete modal after deleting the note */}
                <button onClick={DeleteNoteHandler} className='bg-red-400 p-2 rounded-lg hover:bg-red-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>Yes</button>
            </div>

        </div>
    </div>
  )
}

export default DeleteConfirmationModel