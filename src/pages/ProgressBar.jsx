import React, { useContext } from 'react'
import NotesContext from '../context/NotesContext'


// progress bar which is used to show the progress at the top of navbar
const ProgressBar = () => {

    // getting the progressBar state from the notes context which is used to change the progress of the state and also to show whether the progress bar is visible or not
    const {progressBar} = useContext(NotesContext)

    console.log("progress bar 1")
    // if the progressBar state's show object has value of false then we return null else we return our progress bar
    if(!progressBar.show) return null
    console.log("progress bar 2")
    return (
        <div className="fixed top-0 z-20 h-1 w-full bg-neutral-200 dark:bg-neutral-600">
            <div className="h-1 bg-primary-400 transition-all ease-out duration-1000" style={{ width: `${progressBar.width}%` }}></div>
        </div>
    )
}

export default ProgressBar