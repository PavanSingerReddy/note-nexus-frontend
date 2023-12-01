import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NotesContext from '../context/NotesContext';
import LoaderContext from '../context/LoaderContext';
import httpRequestAxiosQueueUtility from '../utils/HttpRequestAxiosQueueUtility';
import FullPageLoader from './Loaders/FullPageLoader';
import validator from 'validator';
import AlertContext from '../context/AlertContext';

const ResetForgotPasswordPage = () => {


    // useLocation is a react hook which gives the current page url and the query parameters in the react router dom
    const location = useLocation();

    // use navigate is used for routing in to different webpages in the react router
    const navigate = useNavigate();

    // used for setting the progress bar
    const { setProgressBar } = useContext(NotesContext)

    // getting setShowAlert and setAlertErrorMessage from AlertContext
    const { setShowAlert, setAlertErrorMessage } = useContext(AlertContext)

    // loading the isFullPageLoaderActive state and setIsFullPageLoaderActive function from the LoaderContext to show the loading page while verifying the password reset token of the user
    const { isFullPageLoaderActive, setIsFullPageLoaderActive } = useContext(LoaderContext);

    // used to set the the progress bar when any body comes to the Reset Forgot Password Page 
    useEffect(() => {

        // set's the loading bar to 100 percent when we route to this page
        setProgressBar((prevState) => ({
            show: true,
            width: 100
        }))

        // set's the loading bar to 0 after 1 second and hides the loading bar
        setTimeout(() => {
            setProgressBar((prevState) => ({
                show: false,
                width: 0
            }))
        }, 1000);


    }, [])

    // passwordValidation state is used to store the variables required for validating the password fields
    const [passwordValidation, setPasswordValidation] = useState({
        isNewPasswordValid: false,
        isReEnterdNewPasswordValid: false,
        doesNewPasswordAndReEnteredNewPasswordMatch: false,
        isClicked: false
    })

    // PasswordFormData state which is used to store the data of the input password fields
    const [passwordFormData, setPasswordFormData] = useState({
        newpassword: "",
        retypednewpassword: ""
    })

    // function used to populate the password form data to the passwordFormData state when the user types anything in the input elements
    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setPasswordFormData((prevState) => (
            {
                ...prevState,
                [name]: value
            }
        ))
    }


    // when the user comes to this page then we verify the user's password reset token by calling the backend with the user's password reset token value from our react's page url query parameters
    useEffect(() => {

        // getting AbortController from javascript which is used to cancel asynchronous functions like network request etc
        const controller = new AbortController();
        //   extracting signal from the controller of abort controller
        const { signal } = controller;


        // this function is used instead of directly writing the code because useEffect does not support async function so we write this function and call it below
        const exec = async () => {


            // setting the isFullPageLoaderActive to true so that we can see the full loading page while the user is verifying the password reset token
            setIsFullPageLoaderActive(true);
            // getting all our queryparams from the url
            const queryParams = new URLSearchParams(location.search);
            // getting our token query param value from our query params
            const tokenValue = queryParams.get('token');
            // sending request to the backend to verify our password reset token
            try {
                const verificationUrl = `${import.meta.env.VITE_VERIFY_RESET_PASSWORD_VERIFICATION_TOKEN_URL}?token=${tokenValue}`
                await httpRequestAxiosQueueUtility.get(verificationUrl, { signal })
                // set's the loading bar to 100 percent when we successfully verify the password reset token
                setProgressBar((prevState) => ({
                    show: true,
                    width: 100
                }))

                // set's the loading bar to 0 after 1 second and hides the loading bar
                setTimeout(() => {
                    setProgressBar((prevState) => ({
                        show: false,
                        width: 0
                    }))
                }, 1000);

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

            } catch (error) {

                // setting the show Alert to true so that we can see the alert
                setShowAlert(true)
                // setting the alert message based on the error response
                setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

                // if we got any error when we are verifying the password reset token then we send the user to the login page as the token is not valid
                navigate("/login");
            }

        }

        // executing our async function
        exec();

        // if this page unmounts then we are aborting the above network request to verify the password reset token.this return statement is useful to abort multiple network request when we are in developer mode of react
        return () => {
            controller.abort()
        }

    }, [])



    // this function is called when the user presses the Reset password button
    const resetPassword = async () => {

        // checking if the new password entry is empty or not
        const isNewPasswordEmpty = validator.isEmpty(passwordFormData.newpassword)
        // checking if the retyped new password is empty or not
        const isReTypedNewPasswordEmpty = validator.isEmpty(passwordFormData.retypednewpassword)
        // checking if the newpassword and retypednewpassword matches
        const doesNewPasswordAndReEnteredNewPasswordMatch = passwordFormData.newpassword.localeCompare(passwordFormData.retypednewpassword) === 0
        // setting password validation state according to their values
        setPasswordValidation({
            ...passwordValidation,
            isNewPasswordValid: !isNewPasswordEmpty,
            isReEnterdNewPasswordValid: !isReTypedNewPasswordEmpty,
            doesNewPasswordAndReEnteredNewPasswordMatch: doesNewPasswordAndReEnteredNewPasswordMatch,
            isClicked: true
        })

        // changing the password of the user only if the the below conditions meet
        if (!isNewPasswordEmpty && !isReTypedNewPasswordEmpty && doesNewPasswordAndReEnteredNewPasswordMatch) {

            try {
                // getting all our queryparams from the url
                const queryParams = new URLSearchParams(location.search);
                // getting our token query param value from our query params
                const tokenValue = queryParams.get('token');
                // reset password url
                const verificationUrl = `${import.meta.env.VITE_RESET_PASSWORD_VERIFICATION_TOKEN_URL}?token=${tokenValue}`
                await httpRequestAxiosQueueUtility.post(verificationUrl, passwordFormData)
                // set's the loading bar to 100 percent when we successfully change the password of the user
                setProgressBar((prevState) => ({
                    show: true,
                    width: 100
                }))

                // set's the loading bar to 0 after 1 second and hides the loading bar
                setTimeout(() => {
                    setProgressBar((prevState) => ({
                        show: false,
                        width: 0
                    }))
                }, 1000);

                // after completion of the resetting the password then we are routing the user to the login page
                navigate("/login");

            } catch (error) {

                // setting the show Alert to true so that we can see the alert
                setShowAlert(true)
                // setting the alert message based on the error response
                setAlertErrorMessage(error.response && error.response.data && error.response.data.errorMessage ? error.response.data.errorMessage : error.message)

                // setting isFullPageLoaderActive state to false so that the full page loading is disabled
                setIsFullPageLoaderActive(false)

                // if we got any error when we are changing the password of the user we send the user to the login page
                navigate("/login");
            }

        }
    }


    // border color of the new password input field which changes its color according to the new password validation
    let newPasswordBorderColor;
    // border color of the retyped new password input field which changes its color according to the retyped new password validation
    let reTypedNewPasswordBorderColor;

    // if the user clicked on the reset password button then isClicked will be true and if the user's new password is not blank then isValid is also becomes true and if both the new password and Re-entered new password match then doesNewPasswordAndReEnteredNewPasswordMatch becomes true.And Then if all three of these conditions satisfy then we change the border color to green
    if (passwordValidation.isClicked && passwordValidation.isNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch) {
        newPasswordBorderColor = 'green'
    }
    // else if the user clicks on the change password button and the new password is not valid or new password and re-typed new password does not match then border color becomes red
    else if (passwordValidation.isClicked && (!passwordValidation.isNewPasswordValid || !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch)) {
        newPasswordBorderColor = 'red'
    }
    // else the border color of the email will be blue
    else {
        newPasswordBorderColor = '#6b93d7'
    }

    // if the user clicked on the Reset password button then isClicked will be true and if the user's re-typed new password is not blank then isValid is also becomes true and if the new password and retyped new password also matches then doesNewPasswordAndReEnteredNewPasswordMatch becomes true.And Then if all of these three conditions satisfy then we change the border color to green
    if (passwordValidation.isClicked && passwordValidation.isReEnterdNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch) {
        reTypedNewPasswordBorderColor = 'green'
    }
    // else if the user clicks on the change password button and the re-typed new password is not valid then border color becomes red
    else if (passwordValidation.isClicked && (!passwordValidation.isReEnterdNewPasswordValid || !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch)) {
        reTypedNewPasswordBorderColor = 'red'
    }
    // else the border color of the email will be blue
    else {
        reTypedNewPasswordBorderColor = '#6b93d7'
    }

    return (
        <>

            {/* if isFullPageLoaderActive state is true then we show the loading page else we show the actual full page */}
            {isFullPageLoaderActive ? <FullPageLoader /> :
                <>
                    <div className="m-3 flex justify-center items-center h-[90vh] flex-col text-xs sm:text-sm md:text-base">
                        <form className="flex flex-col items-start">
                            {/* new password input */}
                            <label htmlFor='New Password' className='my-3 block text-base font-medium text-dark dark:text-white'>
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    autoComplete='on'
                                    onChange={onchangeHandler}
                                    value={passwordFormData.newpassword}
                                    id='New Password'
                                    name='newpassword'
                                    style={{ borderColor: newPasswordBorderColor }}
                                    type='password'
                                    placeholder='New Password'
                                    className='w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-12 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                />
                                <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </span>

                                {/* if isCliked is true and isNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch also becomes true then we render the tick mark symbol svg */}
                                {

                                    passwordValidation.isClicked && passwordValidation.isNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ?

                                        <span className='absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.0512 3.14409C11.5739 2.48584 9.9234 2.32277 8.34584 2.6792C6.76829 3.03562 5.34821 3.89245 4.29741 5.12189C3.2466 6.35133 2.62137 7.88751 2.51496 9.50132C2.40854 11.1151 2.82665 12.7201 3.70692 14.0769C4.58719 15.4337 5.88246 16.4695 7.39955 17.03C8.91664 17.5905 10.5743 17.6456 12.1252 17.187C13.6762 16.7284 15.0373 15.7808 16.0057 14.4855C16.9741 13.1901 17.4978 11.6164 17.4987 9.99909V9.2329C17.4987 8.77266 17.8718 8.39956 18.332 8.39956C18.7923 8.39956 19.1654 8.77266 19.1654 9.2329V9.99956C19.1642 11.9763 18.5242 13.9002 17.3406 15.4834C16.157 17.0666 14.4934 18.2248 12.5978 18.7853C10.7022 19.3457 8.67619 19.2784 6.82196 18.5934C4.96774 17.9084 3.38463 16.6423 2.30875 14.984C1.23286 13.3257 0.72184 11.3641 0.851902 9.39166C0.981963 7.41922 1.74614 5.54167 3.03045 4.03902C4.31477 2.53637 6.05042 1.48914 7.97854 1.05351C9.90666 0.617872 11.9239 0.817181 13.7295 1.62171C14.1499 1.80902 14.3389 2.30167 14.1516 2.72206C13.9642 3.14246 13.4716 3.3314 13.0512 3.14409Z"
                                                    fill="#22AD5C"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M18.9236 2.74378C19.2492 3.06906 19.2495 3.59669 18.9242 3.92229L10.5909 12.264C10.4346 12.4204 10.2226 12.5083 10.0015 12.5083C9.78042 12.5084 9.56838 12.4206 9.41205 12.2643L6.91205 9.76426C6.58661 9.43882 6.58661 8.91118 6.91205 8.58574C7.23748 8.26031 7.76512 8.26031 8.09056 8.58574L10.001 10.4962L17.7451 2.74437C18.0704 2.41877 18.598 2.41851 18.9236 2.74378Z"
                                                    fill="#22AD5C"
                                                />
                                            </svg>
                                        </span>

                                        : <></>
                                }


                                {/* now if isClicked is true and any one of isNewPasswordValid or doesNewPasswordAndReEnteredNewPasswordMatch becomes true then we render the "!" symbol */}

                                {
                                    passwordValidation.isClicked && (!passwordValidation.isNewPasswordValid || !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch) ?


                                        <span className='absolute top-1/2 right-4 -translate-y-1/2  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.9987 2.50065C5.85656 2.50065 2.4987 5.85852 2.4987 10.0007C2.4987 14.1428 5.85656 17.5007 9.9987 17.5007C14.1408 17.5007 17.4987 14.1428 17.4987 10.0007C17.4987 5.85852 14.1408 2.50065 9.9987 2.50065ZM0.832031 10.0007C0.832031 4.93804 4.93609 0.833984 9.9987 0.833984C15.0613 0.833984 19.1654 4.93804 19.1654 10.0007C19.1654 15.0633 15.0613 19.1673 9.9987 19.1673C4.93609 19.1673 0.832031 15.0633 0.832031 10.0007Z"
                                                    fill="#DC3545"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M10.0013 5.83398C10.4615 5.83398 10.8346 6.20708 10.8346 6.66732V10.0007C10.8346 10.4609 10.4615 10.834 10.0013 10.834C9.54106 10.834 9.16797 10.4609 9.16797 10.0007V6.66732C9.16797 6.20708 9.54106 5.83398 10.0013 5.83398Z"
                                                    fill="#DC3545"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.16797 13.3333C9.16797 12.8731 9.54106 12.5 10.0013 12.5H10.0096C10.4699 12.5 10.843 12.8731 10.843 13.3333C10.843 13.7936 10.4699 14.1667 10.0096 14.1667H10.0013C9.54106 14.1667 9.16797 13.7936 9.16797 13.3333Z"
                                                    fill="#DC3545"
                                                />
                                            </svg>
                                        </span> : <></>


                                }
                            </div>

                            <div className='relative mb-5'>
                                {/* if isCliked is true and isNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch also becomes true then we render the "New Password is valid" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute text-sm text-green-500 ${passwordValidation.isClicked && passwordValidation.isNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ? "" : "invisible"}`}>New Password is valid</p>
                                {/* if isCliked is true and isNewPasswordValid is false then we render the "New Password Must not be blank" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${passwordValidation.isClicked && !passwordValidation.isNewPasswordValid ? "" : "invisible"}`}>New Password Must not be blank</p>

                                {/* if isCliked is true and isNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch becomes false then we render the "Passwords do not match" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${passwordValidation.isClicked && passwordValidation.isNewPasswordValid && !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ? "" : "invisible"}`}>Passwords do not match</p>
                            </div>

                            {/* re-enter new password */}
                            <label htmlFor='Re-enter New Password' className='my-3 block text-base font-medium text-dark dark:text-white'>
                                Re-enter New Password
                            </label>
                            <div className='relative'>
                                <input
                                    autoComplete='on'
                                    onChange={onchangeHandler}
                                    value={passwordFormData.retypednewpassword}
                                    id='Re-enter New Password'
                                    name='retypednewpassword'
                                    type='password'
                                    style={{ borderColor: reTypedNewPasswordBorderColor }}
                                    placeholder='Re-enter New Password'
                                    className='w-[90vw] sm:w-[80vw] md:w-[50vw] bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-12 pl-9 sm:pl-10 md:pl-11 lg:pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                                />
                                <span className='absolute top-1/2 left-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </span>

                                {/* if isCliked is true and isReEnteredNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch also becomes true then we render the tick mark symbol svg */}

                                {

                                    passwordValidation.isClicked && passwordValidation.isReEnterdNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ?

                                        <span className='absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M13.0512 3.14409C11.5739 2.48584 9.9234 2.32277 8.34584 2.6792C6.76829 3.03562 5.34821 3.89245 4.29741 5.12189C3.2466 6.35133 2.62137 7.88751 2.51496 9.50132C2.40854 11.1151 2.82665 12.7201 3.70692 14.0769C4.58719 15.4337 5.88246 16.4695 7.39955 17.03C8.91664 17.5905 10.5743 17.6456 12.1252 17.187C13.6762 16.7284 15.0373 15.7808 16.0057 14.4855C16.9741 13.1901 17.4978 11.6164 17.4987 9.99909V9.2329C17.4987 8.77266 17.8718 8.39956 18.332 8.39956C18.7923 8.39956 19.1654 8.77266 19.1654 9.2329V9.99956C19.1642 11.9763 18.5242 13.9002 17.3406 15.4834C16.157 17.0666 14.4934 18.2248 12.5978 18.7853C10.7022 19.3457 8.67619 19.2784 6.82196 18.5934C4.96774 17.9084 3.38463 16.6423 2.30875 14.984C1.23286 13.3257 0.72184 11.3641 0.851902 9.39166C0.981963 7.41922 1.74614 5.54167 3.03045 4.03902C4.31477 2.53637 6.05042 1.48914 7.97854 1.05351C9.90666 0.617872 11.9239 0.817181 13.7295 1.62171C14.1499 1.80902 14.3389 2.30167 14.1516 2.72206C13.9642 3.14246 13.4716 3.3314 13.0512 3.14409Z"
                                                    fill="#22AD5C"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M18.9236 2.74378C19.2492 3.06906 19.2495 3.59669 18.9242 3.92229L10.5909 12.264C10.4346 12.4204 10.2226 12.5083 10.0015 12.5083C9.78042 12.5084 9.56838 12.4206 9.41205 12.2643L6.91205 9.76426C6.58661 9.43882 6.58661 8.91118 6.91205 8.58574C7.23748 8.26031 7.76512 8.26031 8.09056 8.58574L10.001 10.4962L17.7451 2.74437C18.0704 2.41877 18.598 2.41851 18.9236 2.74378Z"
                                                    fill="#22AD5C"
                                                />
                                            </svg>
                                        </span>

                                        : <></>
                                }


                                {/* now if isClicked is true and any one of isReEnterdNewPasswordValid or doesNewPasswordAndReEnteredNewPasswordMatch becomes true then we render the "!" symbol */}

                                {
                                    passwordValidation.isClicked && (!passwordValidation.isReEnterdNewPasswordValid || !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch) ?


                                        <span className='absolute top-1/2 right-4 -translate-y-1/2  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.9987 2.50065C5.85656 2.50065 2.4987 5.85852 2.4987 10.0007C2.4987 14.1428 5.85656 17.5007 9.9987 17.5007C14.1408 17.5007 17.4987 14.1428 17.4987 10.0007C17.4987 5.85852 14.1408 2.50065 9.9987 2.50065ZM0.832031 10.0007C0.832031 4.93804 4.93609 0.833984 9.9987 0.833984C15.0613 0.833984 19.1654 4.93804 19.1654 10.0007C19.1654 15.0633 15.0613 19.1673 9.9987 19.1673C4.93609 19.1673 0.832031 15.0633 0.832031 10.0007Z"
                                                    fill="#DC3545"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M10.0013 5.83398C10.4615 5.83398 10.8346 6.20708 10.8346 6.66732V10.0007C10.8346 10.4609 10.4615 10.834 10.0013 10.834C9.54106 10.834 9.16797 10.4609 9.16797 10.0007V6.66732C9.16797 6.20708 9.54106 5.83398 10.0013 5.83398Z"
                                                    fill="#DC3545"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.16797 13.3333C9.16797 12.8731 9.54106 12.5 10.0013 12.5H10.0096C10.4699 12.5 10.843 12.8731 10.843 13.3333C10.843 13.7936 10.4699 14.1667 10.0096 14.1667H10.0013C9.54106 14.1667 9.16797 13.7936 9.16797 13.3333Z"
                                                    fill="#DC3545"
                                                />
                                            </svg>
                                        </span> : <></>


                                }
                            </div>

                            <div className='relative mb-8'>
                                {/* if isCliked is true and isReEnterdNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch also becomes true then we render the "Re-entered New Password is valid" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute text-sm text-green-500 ${passwordValidation.isClicked && passwordValidation.isReEnterdNewPasswordValid && passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ? "" : "invisible"}`}>Re-entered New Password is valid</p>
                                {/* if isCliked is true and isReEnterdNewPasswordValid is false then we render the "Re-entered New Password Must not be blank" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${passwordValidation.isClicked && !passwordValidation.isReEnterdNewPasswordValid ? "" : "invisible"}`}>Re-entered New Password Must not be blank</p>
                                {/* if isCliked is true and isReEnterdNewPasswordValid is true and doesNewPasswordAndReEnteredNewPasswordMatch becomes false then we render the "Passwords do not match" paragraph */}
                                <p className={`mt-2 min-w-[90vw] absolute top-0 text-sm text-red-500 ${passwordValidation.isClicked && passwordValidation.isReEnterdNewPasswordValid && !passwordValidation.doesNewPasswordAndReEnteredNewPasswordMatch ? "" : "invisible"}`}>Passwords do not match</p>
                            </div>
                        </form>
                        <button onClick={resetPassword} className="transition ease-in-out delay-150 bg-orange-600 hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300 p-2 lg:p-3 m-2 rounded-lg text-white">
                            Reset Password
                        </button>
                    </div>
                </>
            }
        </>
    )
}

export default ResetForgotPasswordPage