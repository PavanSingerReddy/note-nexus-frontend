import React, { useContext } from 'react'
import "./Note.css"
import { useNavigate } from 'react-router-dom'
import NotesContext from '../context/NotesContext'



const Note = React.forwardRef(({ noteItem, index, onClick }, ref) => {

  const navigate = useNavigate()

  const { setProgressBar } = useContext(NotesContext)

  const editButtonHandler = (event) => {

    event.stopPropagation()
    event.preventDefault()

    setProgressBar((prevState) => ({
      show: true,
      width: 75
    }))

    navigate("/editpage", { state: { noteItem } })
  }



  const viewNoteHandler = (event) => {
    event.preventDefault()

    setProgressBar((prevState) => ({
      show: true,
      width: 75
    }))
    navigate("/viewnote", { state: { noteItem } })
  }


  const getDateAndTime = (element) => {


    let dateObj = new Date(element.updatedAt);




    let date = String(dateObj.getFullYear()).padStart(4, '0') + '-' +
      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
      String(dateObj.getDate()).padStart(2, '0');


    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let time = hours + ':' + minutes + ' ' + ampm;

    return { date, time }

  }

  return (
    <>


      <div ref={ref} onClick={viewNoteHandler} className={`flex cursor-pointer bg-gray-300 relative transition-shadow shadow-sm hover:shadow-2xl p-5 rounded-lg break-all ${(index + 1) % 5 == 0 ? "col-span-2" : ""} ${(index + 1) % 3 == 0 ? "row-span-2" : ""}`}>
        <div className='flex flex-col mb-3'>
          <div className='flex flex-col'>

            <h3 onClick={(e) => e.stopPropagation()} className='font-bold cursor-text text-lg h-6 text-green-900 overflow-auto hide-scroll-bar break-normal'> {noteItem.title} </h3>
          </div>

          <p onClick={(e) => e.stopPropagation()} className='mt-1 cursor-text overflow-auto hide-scroll-bar break-normal'
          > {noteItem.content} </p></div>

        <div className='font-thin cursor-text text-xs absolute left-3 bottom-3'>
          {getDateAndTime(noteItem).time}
        </div>
        <div className='font-thin cursor-text text-xs absolute right-2 top-2'>{getDateAndTime(noteItem).date}</div>




        <button onClick={editButtonHandler} className='bg-orange-300 rounded-full p-2 absolute right-12 bottom-2 hover:bg-orange-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </button>


        <button onClick={onClick} className='bg-red-300 rounded-full p-2 absolute right-2 bottom-2 hover:bg-red-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>
        </button>

      </div>

    </>
  )
})

export default Note