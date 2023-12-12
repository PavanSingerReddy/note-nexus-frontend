import React, { useState } from 'react'
import LoaderContext from './LoaderContext'


const LoaderContextProvider = ({ children }) => {

    const [isFullPageLoaderActive, setIsFullPageLoaderActive] = useState(false)
    return (

        <LoaderContext.Provider value={{ isFullPageLoaderActive, setIsFullPageLoaderActive }}>
            {children}
        </LoaderContext.Provider>
    )
}

export default LoaderContextProvider