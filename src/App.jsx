import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import useFavicon from './hooks/useFavicon';
import LightFavIcon from "./assets/note-nexus-favicon-white.svg";
import DarkFavIcon from "./assets/note-nexus-favicon-black.svg";
import NoteEditPage from './pages/NoteEditPage';
import NotesContextProvider from './context/NotesContextProvider';
import AddNotePage from './pages/AddNotePage';
import ShowNotesPage from './pages/ShowNotesPage';
import ProgressBar from './pages/ProgressBar';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RegistrationVerificationPage from './pages/RegistrationVerificationPage';
import AwaitingConfirmationPage from './pages/AwaitingConfirmationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetForgotPasswordPage from './pages/ResetForgotPasswordPage';
import Alert from './pages/Alert';
import AlertContextProvider from './context/AlertContextProvider';

function App() {

  // when our page loads this custom react hook set's the favicon of the website dynamically based on the user's selected system theme mode like dark mode or light mode
  useFavicon(DarkFavIcon, LightFavIcon)


  return (
    <>
      {/* // wrapping our application in the NotesContextProvider so that our application has access to our Notes context */}
      {/* // wrapping our application in the AlertContextProvider so that our application has access to our Alert context */}
      <AlertContextProvider>
        <NotesContextProvider>
          <ProgressBar />
          <Alert />
          <Router>
            <Routes>
              {/* on signup route of react router we are rendering the signup component */}
              <Route path="/signup" element={<Signup />} />
              {/* after signup user get's routed to the /awaitConfirmation route of react router and here we are rendering the AwaitingConfirmationPage component */}
              <Route path="/awaitConfirmation" element={<AwaitingConfirmationPage />} />
              {/* after user signs up and we get the link to verify the signup we go to this page of react router and we are rendering the RegistrationVerificationPage component */}
              <Route path="/verifyRegistration" element={<RegistrationVerificationPage />} />
              {/* on forgot password route of react router we are rendering the ForgotPasswordPage component */}
              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
              {/* after user enters the email in the /forgotpassword endpoint page then he get's a verification link this the verification link points to the /verifyResetPassword for verification and resetting the password*/}
              <Route path="/verifyResetPassword" element={<ResetForgotPasswordPage />} />
              {/* on Login route of react router we are rendering the Login component */}
              <Route path="/Login" element={<Login />} />
              {/* on changePassword route of react router we are rendering the ChangePasswordPage component */}
              <Route path="/changePassword" element={<ChangePasswordPage />} />
              {/* on editpage route of react router we are rendering the NoteEditPage component */}
              <Route path="/editpage" element={<NoteEditPage />} />
              {/* on addnote route of react router we are rendering the AddNotePage component */}
              <Route path='/addnote' element={<AddNotePage />} />
              {/* on viewnote route of react router we are rendering the ShowNotesPage component */}
              <Route path='/viewnote' element={<ShowNotesPage />} />
              {/* on the application home route or root of the application of react router we are rendering the HomePage component */}
              <Route path="/home" element={<HomePage />} />
              {/* on the root("/") route also we are rendering login page as the user should first login to reach his home page */}
              <Route path="/" element={<Login />} />
              {/* on every other route of react router dom we are rendering the error page */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </NotesContextProvider>
      </AlertContextProvider>
    </>
  )
}

export default App
