import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import NotesContext from "../../context/NotesContext"

// Add note button which is used to add the new note to the user's account
const AddNoteButton = () => {

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // function which routes the user to the addnote endpoint which takes to the AddNotePage component which can be used to add new notes
    const navigate = useNavigate()
    const addNoteButtonOnClick = () => {
        // increasing the progress bar value
        setProgressBar((prevState) => ({
            show: true,
            width: 75
        }))
        navigate("/addnote")
    }


    return (
        // routing the user to the AddNotePage component when the user clicks on the add note page
        <button onClick={addNoteButtonOnClick}
            type="button"
            className="fixed bottom-10 right-10 inline-block rounded-full p-5 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-300 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
        </button>
    )
}

export default AddNoteButton