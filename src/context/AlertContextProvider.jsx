import React, { useState } from 'react'
import AlertContext from './AlertContext'


const AlertContextProvider = ({ children }) => {


    const [showAlert, setShowAlert] = useState(false)

    const [alertErrorMessage, setAlertErrorMessage] = useState("")

    return (

        <AlertContext.Provider value={{ showAlert, setShowAlert, alertErrorMessage, setAlertErrorMessage }}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertContextProvider