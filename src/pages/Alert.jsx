import React, { useContext, useEffect, useState } from 'react';
import AlertContext from '../context/AlertContext';

const Alert = () => {

    // animate state which holds the animation state like animate-fade-down and animate-custom-fade-up.but we are initializing it with hidden because we don't want to show this alert element
    const [animate, setAnimate] = useState("hidden");
    // getting the state values from the Alert context
    const {showAlert,setShowAlert,alertErrorMessage} = useContext(AlertContext);

// useEffect hook which is used to set the animate state animation when ever showAlert state set to true
    useEffect(() => {

        // if the showAlert state is true then we set the animate state to "animate-fade-down" so that we can see the alert element and after 3 seconds we set the animate state to animate-custom-fade-up so that alert can be hidden after 3 seconds and we set the show alert to false
        if (showAlert) {
            setAnimate("animate-fade-down")
            setTimeout(() => {
                setAnimate("animate-custom-fade-up");
            }, 3000);
            setShowAlert(false)
        }

    }, [showAlert])




    return (

        <>

        {/* alert component with animation and position to absolute so that it does not take any space on the dom elements */}
            <div className={`-m-2 absolute z-50 top-10 left-0 right-0 text-center animate-ease-in-out animate-normal ${animate}`}>
                <div className="p-2">
                    <div className="inline-flex items-center bg-white leading-none text-red-600 rounded-full p-2 shadow text-teal text-sm">
                        <span className="inline-flex bg-red-600 text-white rounded-full h-6 px-3 justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                            </svg>
                        </span>
                        {/* rendering the alert error message state */}
                        <span className="inline-flex px-2">{alertErrorMessage}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Alert;
