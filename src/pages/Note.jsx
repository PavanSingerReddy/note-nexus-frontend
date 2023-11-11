import React from 'react'
import "./Note.css"
import { useNavigate } from 'react-router-dom'

// In this notes element we get the following props : noteItem which has the details of the current note element and index which is used for using the row-span or col-span of the grid element and onclick function which is used to perform an delete operation when the user clicks on the delete button on this note element Component
const Note = ({ noteItem, index, onClick }) => {
  // using useNavigate hook which is used for routing in react router dom
  const navigate = useNavigate()

  const editButtonHandler = (event) => {
    // stops the event bubling from the note component as note component also has the onclick event attached to it
    event.stopPropagation()
    event.preventDefault()
    // navigating the user to the /editpage element and along with that we are passing our current note state value to the react router dom which can be accessed by the component on the /editpage endpoint using the useLocation hook
    navigate("/editpage", { state: { noteItem } })
  }


  // view note handler which is used to route the user to the /viewnote endpoint along with the current note element details as a state
  const viewNoteHandler = (event) => {
    event.preventDefault()
    navigate("/viewnote", { state: { noteItem } })
  }

  // function which returns the date and time from the note element data
  const getDateAndTime = (element) => {

    // creating new date object with our note element's updatedAt time
    let dateObj = new Date(element.updatedAt);


    // In this below code, getFullYear() method returns the year, getMonth returns the month (0-11, so we add 1), and getDate returns the day of the month (1-31). We use padStart to ensure that the month and day are always two digits long and year is always 4 digit long

    let date = String(dateObj.getFullYear()).padStart(4, '0') + '-' +
      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
      String(dateObj.getDate()).padStart(2, '0');

    // Extract time in AM/PM format code
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let time = hours + ':' + minutes + ' ' + ampm;

    return { date, time }

  }

  return (
    <>
      {/* if the user clicks on this note then we execute the viewNoteHandler which sends the user to another route /viewnote which shows the note details and we are also adjusting the col-span and row-span of the grid element based on the index number so that the style of the note element looks unique and also making the outer element flex and also making all its inner elements flex so that the text does not overflow out of the container */}
      <div onClick={viewNoteHandler} className={`flex cursor-pointer bg-gray-300 relative transition-shadow shadow-sm hover:shadow-2xl p-5 rounded-lg break-all ${(index + 1) % 5 == 0 ? "col-span-2" : ""} ${(index + 1) % 3 == 0 ? "row-span-2" : ""}`}>
        <div className='flex flex-col mb-3'>
          <div className='flex flex-col'>
            {/* we are stoping propogation of event bubling from the above div which has onClick event attached to it so that the user can select the title of the note properly */}
            <h3 onClick={(e) => e.stopPropagation()} className='font-bold cursor-text text-lg h-6 text-green-900 overflow-auto hide-scroll-bar'> {noteItem.title} </h3>
          </div>
          {/* we are stoping propogation of event bubling from the above div which has onClick event attached to it so that the user can select the content of the note properly*/}
          <p onClick={(e) => e.stopPropagation()} className='mt-1 cursor-text overflow-auto hide-scroll-bar'
          > {noteItem.content} </p></div>

        <div className='font-thin cursor-text text-xs absolute z-10 left-3 bottom-3'>
          {getDateAndTime(noteItem).time}
        </div>
        <div className='font-thin cursor-text text-xs absolute z-10 right-2 top-2'>{getDateAndTime(noteItem).date}</div>



        {/* used to route the user to the user to the /editpage with the current user note details */}
        <button onClick={editButtonHandler} className='bg-orange-300 rounded-full p-2 absolute right-12 bottom-2 hover:bg-orange-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </button>

        {/* executes the delete note functionality when the user clicks on this button as we are adding the onclick function which we got as a prop as event handler*/}
        <button onClick={onClick} className='bg-red-300 rounded-full p-2 absolute right-2 bottom-2 hover:bg-red-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>
        </button>

      </div>

    </>
  )
}

export default Note