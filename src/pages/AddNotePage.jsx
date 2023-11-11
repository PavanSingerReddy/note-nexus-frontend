import React, { useEffect, useState } from 'react'
import {
    Input,
    initTE,
} from "tw-elements";
import BackButton from './buttons/BackButton';
import SaveButton from './buttons/SaveButton';
import Navbar from './Navbar';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import { useNavigate } from 'react-router-dom';

const AddNotePage = () => {

    // useEffect hook which is used to initialize the javascript for the input elements
    useEffect(() => {
        initTE({ Input });
    }, [])

    // navigate hook which is used to navigate to the different routes in the react router dom
    const navigate = useNavigate()


    // state for accessing the values of the input element of the new note
    const [noteData, setNoteData] = useState({
        title: "",
        content: ""
    })

    // function used to populate the note data to the noteData state when the user types anything in the input elements
    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setNoteData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // onClickHandler which adds the new note to the user when the user clicks on the tick mark button 
    const onClickHandler = async (event) => {
        event.preventDefault()
        const addNoteUrl = "http://localhost:8080/api/notes/create"
        await httpRequestAxiosQueueUtility.authenticatedPost(addNoteUrl, noteData)
        navigate("/")
    }

    // back button which goes to the user's home page which shows all the notes of the user
    const onClickBackButtonHandler = (event) => {
        event.preventDefault()
        navigate("/")
    }

    return (
        <>

            {/* navbar element which is used to logout a user and also shows the application branding */}
            <Navbar />
            <div className='relative'>
                {/* passing the onClickBackButtonHandler which routes the user to the home page ("/") which contains all the user notes */}
                <div className="relative top-1"><BackButton onClickBackButtonHandler={onClickBackButtonHandler} /></div>
                <div className='absolute right-1 top-1'>
                    {/* passing the onClickHandler which saves the new notes to the user account */}
                    <SaveButton onClickHandler={onClickHandler} />
                </div>
                {/* Text */}
                <div className="relative m-3" data-te-input-wrapper-init>
                    <input
                        // onchangeHandler takes the input from the user and stores them in the formData state
                        onChange={onchangeHandler}
                        type="text"
                        className="peer block h-12  w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Heading"
                        name='title'
                        value={noteData.title}
                        placeholder="Note Heading" />
                    <label
                        htmlFor="Note Heading"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-slate-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Note Title
                    </label>
                </div>
                {/* Textarea */}
                <div className="relative m-3" data-te-input-wrapper-init>
                {/* onchangeHandler takes the input from the user and stores them in the formData state */}
                    <textarea
                        onChange={onchangeHandler}
                        name='content'
                        className="peer block h-96 w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Content"
                        rows="4"
                        value={noteData.content}
                        placeholder="Note Content"></textarea>
                    <label
                        htmlFor="Note Content"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-slate-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Note Content
                    </label>
                </div>
            </div>
        </>
    )
}

export default AddNotePage