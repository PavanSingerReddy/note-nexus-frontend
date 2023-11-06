import React, { useEffect } from 'react'
// Initialization for ES Users
import {
    Input,
    initTE,
} from "tw-elements";
import BackButton from './buttons/BackButton';

const ShowNotesPage = () => {
    useEffect(() => {

        initTE({ Input });

    }, [])

    return (
        <>

            <BackButton />

            <div class="relative m-3" data-te-input-wrapper-init>
                <input
                    type="text"
                    class="peer block min-h-[auto] w-full rounded border-0 bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="Note Heading"
                    value="Readonly input here..."
                    aria-label="Note Heading"
                    readOnly />
                <label
                    for="Note Heading"
                    class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Readonly input
                </label>
            </div>


            <div class="relative m-3" data-te-input-wrapper-init>
                <textarea
                    class="peer h-96 block min-h-[auto] w-full rounded border-0 bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700  dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="Note Content"
                    rows="4"
                    value={"my message"}
                    placeholder="Note Content"
                    readOnly></textarea>
                <label
                    for="Note Content"
                    class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Example textarea
                </label>
            </div>
        </>
    )
}

export default ShowNotesPage