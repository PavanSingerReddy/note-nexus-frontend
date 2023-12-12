import getNotesPage from '../utils/getNotesPage'
import { useEffect } from 'react'
import { useState } from 'react'


const useNotes = (pageNum = 0) => {

    const [results, setResults] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const [isError, setIsError] = useState(false)

    const [error, setError] = useState({})

    const [hasNextPage, setHasNextPage] = useState(false)


    useEffect(() => {

        setIsLoading(true)

        setIsError(false)

        setError({})


        const controller = new AbortController()

        const { signal } = controller


        getNotesPage(pageNum, { signal })
            .then(data => {

                setResults(prev => {
                    const newState = [...prev, ...data];
                    return newState;
                });


                setHasNextPage(Boolean(data.length))

                setIsLoading(false)
            })
            .catch(e => {

                setIsLoading(false)

                if (signal.aborted) return

                setIsError(true)

                setError(e)
            })


        return () => {
            controller.abort()
        }

    }, [pageNum])



    return { isLoading, isError, error, results, hasNextPage }
}

export default useNotes