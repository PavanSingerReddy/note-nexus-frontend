import React, { useContext, useEffect, useState } from 'react'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility'
import { Navigate, useLocation } from 'react-router-dom'
import FullPageLoader from '../pages/Loaders/FullPageLoader'
import AlertContext from '../context/AlertContext'
import NotesContext from '../context/NotesContext'

// VerifyToken Component is a Higher-Order-Function(HOC).In React, a Higher-Order Component (HOC) is an advanced technique for reusing component logic.It’s not part of the React API, but a pattern that emerges from React’s compositional nature.

// Concretely, a HOC is a function that takes a component as an argument and returns a new component that wraps the original component. This allows you to add additional functionality to a component without modifying the component’s code

// Here we are using this VerifyToken HOC to add capability to verify the token in the query parameter for a particular request is valid or not for the Supplied Component(VerificationPageComponent) and we verify this by sending the request to the backend with the given url
const VerifyToken = (VerificationPageComponent, url) => {

    // returning our modified function which checks if the token in the url parameter is valid or not by requesting the backend with the given url.And if the token is valid then it returns the actual VerificationPageComponent with the props of that VerificationPageComponent. else if the token is invalid then we return the user to the login page using the Navigate component.if the token checking process is still happening then we return the FullPageLoader component

    // Here props will be given to us by the React when we return this function and in the props argument of this returned function react fills the props which was given to the Component(VerificationPageComponent)
    return (props) => {

        // used for setting the progress bar
        const { setProgressBar } = useContext(NotesContext)

        // getting setShowAlert and setAlertErrorMessage from AlertContext
        const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

        // useLocation is a react hook which gives the current page url and the query parameters in the react router dom
        const location = useLocation();

        // This state is used to track if the token in the url parameters of the page is valid or not initially it is null and after verification it becomes true or false
        const [isVerified, setIsVerified] = useState(null)


        // This useEffect hook is used to verify the Token given to us is valid or not by calling the backend with the verification token value from our react's page url query parameters
        useEffect(() => {

            // getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
            const controller = new AbortController();
            //   extracting signal from the controller of abort controller
            const { signal } = controller;



            // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
            const exec = async () => {
                // getting all our query params from the url
                const queryParams = new URLSearchParams(location.search);
                // getting our token query param value from our query params
                const tokenValue = queryParams.get('token');
                // sending request to the backend to verify our token by using the backend url given to this HOC function as an argument and the token value
                try {
                    const verificationUrl = `${url}?token=${tokenValue}`
                    await httpRequestAxiosQueueUtility.get(verificationUrl, { signal })

                    // aborting any operation if we cancelled the above network request which is used to verify the token
                    if (signal.aborted) {
                        return
                    }
                    // set's the progress bar to 80 percent when we route to this page
                    setProgressBar((prevState) => ({
                        show: true,
                        width: 80
                    }))
                    // after the token is verified we change the state of the setIsVerified to true
                    setIsVerified(true)

                } catch (error) {

                    // setting the show Alert to true so that we can see the alert
                    setShowAlert(true)
                    // setting the alert message based on the error response
                    setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)
                    // here we set the setIsVerified state to false as we got error while verifying the token
                    setIsVerified(false)
                }

            }

            // executing our async function
            exec();

            // if this component unmounts then we are aborting any network request if the network request are pending and not completed.if they are already completed and there are no network request pending of this useEffect then nothing happens
            return () => {
                controller.abort()
            }

        }, [])

        // if the token verification process is still happening then the isVerified state will be null then we will return the FullPageLoader Component which shows the full Loading page animation
        if (isVerified === null) {
            return <FullPageLoader />
        }

        // if the token is verified then we return the Component(VerificationPageComponent) which was given to this HOC(Higher-Order-Function) and we are also passing the props to this component.These props will be given to us by the React when we return this function and in the props argument of this returned function react fills the props which was given to the Component(VerificationPageComponent) and here we are also passing the props which was given to us by react for VerificationPageComponent after the token is verified successfully.

        // if the token is not verified then we return the ' <Navigate to="/login" replace /> ' Component.In react-router-dom v6, returning <Navigate to="/login" replace /> from a component will cause the app to navigate to the “/login” route. The replace prop means that this new location will replace the current entry in the history stack of react-router-dom.

        // This means that if you click the back button in your browser, it won’t take you back to the page that rendered <Navigate to="/login" replace />, but instead to whatever page was before that in your history stack
        return isVerified ? <VerificationPageComponent {...props} /> : <Navigate to="/login" replace />

    }
}

// exporting our Higher-Order-Function
export default VerifyToken