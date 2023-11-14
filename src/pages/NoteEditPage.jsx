import React, { useEffect, useRef, useState } from 'react'
import BackButton from './buttons/BackButton';
import SaveButton from './buttons/SaveButton';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Input,
    initTE,
} from "tw-elements";
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';

const NoteEditPage = () => {

    // use navigate hook which is used for routing in the react router dom
    const navigate = useNavigate()
    // ref which is used in react to refer to the element in the dom 
    // here input ref is used to refer to the input element which is the note title and textarea ref is used to refer to the textarea element which is the note content element
    const inputRef = useRef();
    const textArea = useRef();

    // useEffect is used to initilaize the input elements which activates the javascript of the input and textarea elements to show the animation effect
    useEffect(() => {
        initTE({ Input });
        // we focus on textarea first so that the javascript can be activated on the note content element which is the textarea element
        textArea.current.focus()
        // and after we want the javascript can be activated on the note title element so that the animation can be shown on the input element which shows the text heading
        inputRef.current.focus()
    }, [])

    // use location is used to access the state which is passed in the react router dom using the useNavigate() hook
    const location = useLocation()
    const note = location.state.noteItem;

    // using setNoteData to populate the values of the note title and note content of the selected note which the user want to edit.The note state is passed using useNavigate() hook and accessed by using the useLocation() hook
    const [noteData, setNoteData] = useState(note)

    // this onchange event handler updates the value of the noteData state with the edited data
    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setNoteData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // onClickHandler which is used to handle the edited note and update the edited note in our backend 
    const onClickHandler = async (event) => {
        event.preventDefault()
        // url to update the note using it's note id
        // importing edit note url using the environment variables in the root directory of this application
        const editNoteUrl = `${import.meta.env.VITE_Edit_NOTE_URL}${noteData.noteId}`
        await httpRequestAxiosQueueUtility.authenticatedPut(editNoteUrl, noteData)
        // after editing the note we are navigating to the home page of the user
        navigate("/")
    }

    // function which is used to handle the back button click and navigate the user to the home page
    const onClickBackButtonHandler = (event) => {
        event.preventDefault()
        navigate("/")
    }


    return (
        <>

            <Navbar />
            <div className='relative'>
                <div className="relative top-1">
                    <BackButton onClickBackButtonHandler={onClickBackButtonHandler} /></div>
                <div className='absolute right-1 top-1'>
                    <SaveButton onClickHandler={onClickHandler} />
                </div>
                {/* Text */}
                <div className="relative m-3" data-te-input-wrapper-init>
                    {/* read only input */}
                    <input
                        onChange={onchangeHandler}
                        type="text"
                        className="peer block h-12  w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Heading"
                        name='title'
                        value={noteData.title}
                        // using ref variable of useRef() hook to hook this input to the inputRef hook
                        ref={inputRef}
                        placeholder="Note Heading" />
                    <label
                        htmlFor="Note Heading"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-slate-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Note Heading
                    </label>
                </div>
                {/* Textarea */}
                <div className="relative m-3" data-te-input-wrapper-init>
                    {/* readonly textarea */}
                    <textarea
                        // using ref variable of useRef() hook to hook this textarea to the textArea hook
                        ref={textArea}
                        name='content'
                        onChange={onchangeHandler}
                        className="peer block h-96 w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Content"
                        rows="4"
                        value={noteData.content}
                        // data-te-input-state-active
                        placeholder="Note Content"
                    ></textarea>
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

export default NoteEditPage