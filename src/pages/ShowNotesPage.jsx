import React, { useEffect, useRef } from 'react'
// Initialization for ES Users
import {
    Input,
    initTE,
} from "tw-elements";
import BackButton from './buttons/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ShowNotesPage = () => {

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

    // use navigate hook which is used for routing in the react router dom
    const navigate = useNavigate()
    // use location is used to access the state which is passed in the react router dom using the useNavigate() hook
    const location = useLocation()
    const note = location.state.noteItem;

    // function which is used to handle the back button click and navigate the user to the home page
    const onClickBackButtonHandler = (event) => {
        event.preventDefault()
        navigate("/")
    }

    return (
        <>

            <Navbar />
            <BackButton onClickBackButtonHandler={onClickBackButtonHandler} />

            <div className="relative m-3" data-te-input-wrapper-init>
                <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="Note Heading"
                    value={note.title}
                    // using ref variable of useRef() hook to hook this input to the inputRef hook
                    ref={inputRef}
                    aria-label="Note Heading"
                    readOnly />
                <label
                    htmlFor="Note Heading"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Readonly input
                </label>
            </div>


            <div className="relative m-3" data-te-input-wrapper-init>
                <textarea
                    className="peer h-96 block min-h-[auto] w-full rounded border-0 bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700  dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="Note Content"
                    rows="4"
                    value={note.content}
                    // using ref variable of useRef() hook to hook this textarea to the textArea hook
                    ref={textArea}
                    placeholder="Note Content"
                    readOnly></textarea>
                <label
                    htmlFor="Note Content"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Example textarea
                </label>
            </div>
        </>
    )
}

export default ShowNotesPage