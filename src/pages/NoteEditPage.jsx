import React, { useEffect } from 'react'
import {
    Input,
    initTE,
} from "tw-elements";
import BackButton from './buttons/BackButton';
import SaveButton from './buttons/SaveButton';
import Navbar from './Navbar';

const NoteEditPage = () => {

    useEffect(() => {
        initTE({ Input });
    }, [])


    return (
        <>

            <Navbar />
            <div className='relative'>
                <div className="relative top-1"><BackButton /></div>
                <div className='absolute right-1 top-1'>
                    <SaveButton />
                </div>
                {/* Text */}
                <div className="relative m-3" data-te-input-wrapper-init>
                    <input
                        type="text"
                        className="peer block h-12  w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Heading"
                        placeholder="Note Heading" />
                    <label
                        htmlFor="Note Heading"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-slate-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Note Heading
                    </label>
                </div>
                {/* Textarea */}
                <div className="relative m-3" data-te-input-wrapper-init>
                    <textarea
                        className="peer block h-96 w-full rounded border-0 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="Note Content"
                        rows="4"
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

export default NoteEditPage