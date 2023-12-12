import React, { useContext } from 'react'
import NotesContext from '../context/NotesContext'



const ProgressBar = () => {


    const { progressBar } = useContext(NotesContext)


    if (!progressBar.show) return null
    return (
        <div className="fixed top-0 z-20 h-1 w-full bg-neutral-200 dark:bg-neutral-600">
            <div className="h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 transition-all ease-out duration-1000" style={{ width: `${progressBar.width}%` }}></div>
        </div>
    )
}

export default ProgressBar