import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import useFavicon from './hooks/useFavicon';
import LightFavIcon from "./assets/note-nexus-favicon-white.svg"
import DarkFavIcon from "./assets/note-nexus-favicon-black.svg"
import NoteEditPage from './pages/NoteEditPage';
import NotesContextProvider from './context/NotesContextProvider';
import AddNotePage from './pages/AddNotePage';
import ShowNotesPage from './pages/ShowNotesPage';
import ProgressBar from './pages/ProgressBar';
import LoaderContextProvider from './context/LoaderContextProvider';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RegistrationVerificationPage from './pages/RegistrationVerificationPage';
import AwaitingConfirmationPage from './pages/AwaitingConfirmationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetForgotPasswordPage from './pages/ResetForgotPasswordPage';
import Alert from './pages/Alert';
import AlertContextProvider from './context/AlertContextProvider';

function App() {


  useFavicon(DarkFavIcon, LightFavIcon)


  return (

    <LoaderContextProvider>
      <AlertContextProvider>
        <NotesContextProvider>
          <ProgressBar />
          <Alert />
          <Router>
            <Routes>

              <Route path="/signup" element={<Signup />} />

              <Route path="/awaitConfirmation" element={<AwaitingConfirmationPage />} />

              <Route path="/verifyRegistration" element={<RegistrationVerificationPage />} />

              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />

              <Route path="/verifyResetPassword" element={<ResetForgotPasswordPage />} />

              <Route path="/Login" element={<Login />} />

              <Route path="/changePassword" element={<ChangePasswordPage />} />

              <Route path="/editpage" element={<NoteEditPage />} />

              <Route path='/addnote' element={<AddNotePage />}></Route>

              <Route path='/viewnote' element={<ShowNotesPage />}></Route>

              <Route path="/" element={<HomePage />} />

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </NotesContextProvider>
      </AlertContextProvider>
    </LoaderContextProvider>
  )
}

export default App
