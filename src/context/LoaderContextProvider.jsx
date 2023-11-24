import React, { useState } from 'react'
import LoaderContext from './LoaderContext'

// Loader Context provider holds all the states of information regarding the loading and we can import this states using the Loader context
const LoaderContextProvider = ({ children }) => {
    // isFullPageLoaderActive state holds the information whether we should load show the loading animation or not
    const [isFullPageLoaderActive, setIsFullPageLoaderActive] = useState(false)
    return (
        // The values we provide in the Loader context provider will be accessible by the child components of the Loader context provider 
        <LoaderContext.Provider value={{ isFullPageLoaderActive, setIsFullPageLoaderActive }}>
            {children}
        </LoaderContext.Provider>
    )
}

export default LoaderContextProvider