import React, { useContext, useEffect, useState } from 'react'
import NotesContext from '../context/NotesContext'
import AlertContext from '../context/AlertContext'
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility'
import { Navigate } from 'react-router-dom'
import FullPageLoader from '../pages/Loaders/FullPageLoader'


// IsNotAuthenticatedPage Component is a Higher-Order-Function(HOC).In React, a Higher-Order Component (HOC) is an advanced technique for reusing component logic.It’s not part of the React API, but a pattern that emerges from React’s compositional nature.

// Concretely, a HOC is a function that takes a component as an argument and returns a new component that wraps the original component. This allows you to add additional functionality to a component without modifying the component’s code

// Here we are using this IsNotAuthenticatedPage HOC to add authentication capability to the Supplied Component(PageComponent).Here IsNotAuthenticatedPage verifies that the user is unauthenticated
const IsNotAuthenticatedPage = (PageComponent) => {

    // returning our modified function which checks if the user is unauthenticated or not and if the user is unauthenticated then it returns the actual PageComponent with the props of that PageComponent. else if the user is authenticated then we return the user to the home page using the Navigate component.if the authentication process is still happening then we return the FullPageLoader component

    // Here props will be given to us by the React when we return this function and in the props argument of this returned function react fills the props which was given to the Component(PageComponent)
    return (props) => {

        // getting setProgressBar from the NotesContext
        const { setProgressBar } = useContext(NotesContext)

        // getting setShowAlert and setAlertErrorMessage from AlertContext
        const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

        // This state is used to track if the user is unauthenticated or not initially it is null and after authentication it becomes true or false
        const [isNotAuthenticated, setIsNotAuthenticated] = useState(null);

        // Check authentication status using this useEffect hook and update the isNotAuthenticated state accordingly.This useEffect is used to check if the user is unauthenticated or not and it changes it's isNotAuthenticated state accordingly
        useEffect(() => {
            // getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
            const controller = new AbortController()

            // extracting signal from the controller of abort controller
            const { signal } = controller

            // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
            const exec = async () => {

                // checking if the user is unauthenticated or not and passing signal to cancel the request in the below return statement of this useEffect hook if this component unmounts so that we don't need to make multiple request if this component loads two or three times repeatedly
                try {
                    // making the network request which checks if the user is authenticated or not.if this request is successful with out any errors then the user is authenticated else if we get any network error during this request the user is not authenticated
                    await httpRequestAxiosQueueUtility.isAuthenticated({ signal })

                    // aborting any operation if we cancelled the isAuthenticated network request
                    if (signal.aborted) {
                        return
                    }

                    // set's the progress bar to 80 percent when we route to this page
                    setProgressBar((prevState) => ({
                        show: true,
                        width: 80
                    }))

                    // after the authentication is successful we change the state of the isNotAuthenticated to false.because the user is authenticated but here we are checking if the user is unauthenticated(Not Authenticated) or not
                    setIsNotAuthenticated(false)
                    // setting the show Alert to true so that we can see the alert
                    setShowAlert(true)
                    // setting the alert message to show alert that the user is already authenticated
                    setAlertErrorMessage("User is already Authenticated Returning to Home Page");

                } catch (error) {
                    // here we set the isNotAuthenticated state to true.because the user is not authenticated but here we are checking if the user is unauthenticated(Not Authenticated) or not so we set the isNotAuthenticated to true as the user is not authenticated
                    setIsNotAuthenticated(true)
                }
            }
            // calling the exec() function to perform our user authentication process
            exec();


            // if this component unmounts then we are aborting any network request if the network request are pending and not completed.if they are already completed and there are no network request pending of this useEffect then nothing happens
            return () => {
                controller.abort()
            }

        }, [])

        // if the authentication still happening then the isNotAuthenticated state will be null then we will return the FullPageLoader Component which shows the full Loading page animation
        if (isNotAuthenticated === null) {
            return <FullPageLoader />
        }

        // if the user is unauthenticated then we return the Component(PageComponent) which was given to this HOC(Higher-Order-Function) and we are also passing the props to this component.These props will be given to us by the React when we return this function and in the props argument of this returned function react fills the props which was given to the Component(PageComponent) and here we are also passing the props which was given to us by react for PageComponent after isNotAuthenticated becomes true.

        // if the user is authenticated then we return the ' <Navigate to="/home" replace /> ' Component.In react-router-dom v6, returning <Navigate to="/home" replace /> from a component will cause the app to navigate to the "/home" route. The replace prop means that this new location will replace the current entry in the history stack of react-router-dom.

        // This means that if you click the back button in your browser, it won’t take you back to the page that rendered <Navigate to="/home" replace />, but instead to whatever page was before that in your history stack
        return isNotAuthenticated ? <PageComponent {...props} /> : <Navigate to="/home" replace />
    }
}

export default IsNotAuthenticatedPage