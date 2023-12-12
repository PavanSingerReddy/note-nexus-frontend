import React, { useContext } from 'react'
import NotesContext from '../../context/NotesContext';
import httpRequestAxiosQueueUtility from '../../utils/HttpRequestAxiosQueueUtility';
import AlertContext from '../../context/AlertContext';


const DeleteConfirmationModel = ({ noteItem }) => {


    const { setShowNoteDeleteModal, notes, setSortedNotes, setProgressBar } = useContext(NotesContext)



    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)


    const onClickHandler = (event) => {
        event.preventDefault()
        if (event.target.id === "deleteModalBackground" || event.target.id === "closeModal") setShowNoteDeleteModal(false)

    }


    const DeleteNoteHandler = async (event) => {
        event.preventDefault()


        setProgressBar((prevState) => ({
            show: true,
            width: 25
        }))



        const deleteNoteUrl = `${import.meta.env.VITE_DELETE_NOTE_URL}${noteItem.noteId}`
        try {

            setProgressBar((prevState) => ({
                show: true,
                width: 50
            }))

            await httpRequestAxiosQueueUtility.delete(deleteNoteUrl)

            setProgressBar((prevState) => ({
                show: true,
                width: 100
            }))


            setTimeout(() => {
                setProgressBar((prevState) => ({
                    show: false,
                    width: 0
                }))
            }, 1000);
        } catch (error) {

            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))


            setShowAlert(true)

            setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
        }

        const newNotes = notes.filter(note => note.noteId !== noteItem.noteId)

        setSortedNotes(newNotes)

        setShowNoteDeleteModal(false)
    }

    return (


        <div id='deleteModalBackground' onClick={onClickHandler} className='z-10 fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center'>

            <div className="bg-zinc-100 p-6 h-auto max-h-[calc(100dvh)] flex overflow-auto flex-col rounded-lg">
                <div>
                    <p className='italic font-extrabold m-4 text-xl'>Are you sure you want to delete the below Note ?</p>
                    <span className='font-bold ml-4 m-1'>Note Title : </span> <span className='text-teal-900 font-mono'>{noteItem.title}</span>
                </div>
                <div className='flex justify-around m-5'>

                    <button id='closeModal' onClick={onClickHandler} className='bg-green-400 p-2 rounded-lg hover:bg-green-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>No</button>

                    <button onClick={DeleteNoteHandler} className='bg-red-400 p-2 rounded-lg hover:bg-red-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>Yes</button>
                </div>

            </div>
        </div>
    )
}

export default DeleteConfirmationModel