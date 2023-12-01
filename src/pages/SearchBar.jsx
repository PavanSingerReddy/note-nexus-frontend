import React, { useContext } from 'react'
import NotesContext from '../context/NotesContext';


const SearchPage = () => {

    // using searchTerm and setSearchTerm states from the Notes context
    const { searchTerm, setSearchTerm } = useContext(NotesContext)

    return (
        <>
            <div className='relative mb-3 m-4'>
                <input
                    type='search'
                    placeholder="Note Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full bg-white rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                />
                <span className='absolute top-1/2 left-4 -translate-y-1/2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#9CA3AF" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </span>
            </div>
        </>
    )
}

export default SearchPage