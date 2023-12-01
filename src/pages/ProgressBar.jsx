import React, { useContext } from 'react'
import NotesContext from '../context/NotesContext'


// progress bar which is used to show the progress at the top of navbar
const ProgressBar = () => {

    // getting the progressBar state from the notes context which is used to change the progress of the state and also to show whether the progress bar is visible or not
    const { progressBar } = useContext(NotesContext)

    // if the progressBar state's show object has value of false then we return null else we return our progress bar
    if (!progressBar.show) return null
    return (
        <div className="fixed top-0 z-20 h-1 w-full bg-neutral-200 dark:bg-neutral-600">
            <div className="h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 transition-all ease-out duration-1000" style={{ width: `${progressBar.width}%` }}></div>
        </div>
    )
}

export default ProgressBar