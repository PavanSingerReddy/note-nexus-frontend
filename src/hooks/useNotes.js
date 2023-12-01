import getNotesPage from '../utils/getNotesPage'
import { useEffect } from 'react'
import { useState } from 'react'

// we get pageNum state as a prop if we didnot get anything then we set it to the default value of 0
const useNotes = (pageNum = 0) => {
    // state which contains all the notes and updates by appending new notes as the user scrolls 
    const [results, setResults] = useState([])
    // state which is used to set the loading to true or false we set it to true when we are doing network request for getting the next page of note
    const [isLoading, setIsLoading] = useState(false)
    // state which is used to check if any error occured while fetching our notes
    const [isError, setIsError] = useState(false)
    // if the isError state is true then we can check this error state for the type of error we got
    const [error, setError] = useState({})
    // used to check if there exists a next page of notes
    const [hasNextPage, setHasNextPage] = useState(false)

    // useEffect which is executes if the pageNum state changes.we change the pageNum state from the intersectionObserver if the user reaches the last page and increment it by one
    useEffect(() => {
        // setting the isLoading state to true because we are doing network request for getting more notes as the pageNum state changed
        setIsLoading(true)
        //   Resetting the isError to false as we are starting new network request to backend
        setIsError(false)
        //   also Resetting the setError object to an empty object
        setError({})

        //   getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
        const controller = new AbortController()
        //   extracting signal from the controller of abort controller
        const { signal } = controller

        // using getNotesPage which makes the network request to the backend to get the notes array by page number and also passing signal so that we can cancel the network request if this hook unmounts which will save us from getting duplicates values in the results state
        getNotesPage(pageNum, { signal })
            .then(data => {
                // appending the new notes array from the getNotespage network request to already existing notes array in the results state by using setResults
                setResults(prev => {
                    const newState = [...prev, ...data];
                    return newState;
                });

                // updates if the next page or in this context the current loaded page exists or not by checking the length of the notes array we got from getNotesPage network request if the array is not empty then we set the hasNextPage state as true.If the array is empty then we set the hasNextPage value to false
                setHasNextPage(Boolean(data.length))
                // after the network request has ended and all the states have been set perfectly we are setting the isLoading state to false
                setIsLoading(false)
            })
            .catch(e => {
                // if any error occurs while getting our notes array page from the backend using getNotesPage we are setting the isLoading state to false
                setIsLoading(false)
                // if the error we got is because of the aborted network request which we made during this hook unmount then we are just returning and not setting any error 
                if (signal.aborted) return
                // else we are setting isError to true as error has occured while making network requests
                setIsError(true)
                // and we are setting the state of the error to the error object
                setError({ message: e })
            })

            // if this custom hook unmounts then we are aborting any network request if the network request are pending and not completed.if they are already completed and there are no network request pending regarding the getNotesPage then nothing happens
        return () => {
            controller.abort()
        }

    }, [pageNum])


    // returning all the states of this custom hook
    return { isLoading, isError, error, results, hasNextPage }
}

export default useNotes