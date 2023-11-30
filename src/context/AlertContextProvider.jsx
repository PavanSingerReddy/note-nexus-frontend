import React, { useState } from 'react'
import AlertContext from './AlertContext'

// Alert Context Provider holds all the states of information regarding the showing of alert and it's message and we can import these states using the Alert context
const AlertContextProvider = ({ children }) => {

    // showAlert state which holds whether to show the alert or not.if the state is false then we don't show the alert if the state is true then we show the alert
    const [showAlert, setShowAlert] = useState(false)
    // alertErrorMessage state which holds the message to show when the alert loads
    const [alertErrorMessage, setAlertErrorMessage] = useState("")

    return (
        // The values we provide in the Alert Context provider will be accessible by the child components of the Alert context provider 
        <AlertContext.Provider value={{ showAlert, setShowAlert, alertErrorMessage, setAlertErrorMessage }}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertContextProvider