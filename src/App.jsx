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

function App() {

  // when our page loads this custom react hook set's the favicon of the website dynamically based on the user's selected system theme mode like dark mode or light mode
  useFavicon(DarkFavIcon, LightFavIcon)


  return (
    // wrapping our application in the LoaderContextProvider so that our application has access to our Loader Context
    <LoaderContextProvider>
      {/* // wrapping our application in the NotesContextProvider so that our application has access to our Notes context */}
      <NotesContextProvider>
        <ProgressBar />
        <Router>
          <Routes>
            {/* on signup route of react router we are rendering the signup component */}
            <Route path="/signup" element={<Signup />} />
            {/* on Login route of react router we are rendering the Login component */}
            <Route path="/Login" element={<Login />} />
            {/* on changePassword route of react router we are rendering the ChangePasswordPage component */}
            <Route path="/changePassword" element={<ChangePasswordPage />} />
            {/* on editpage route of react router we are rendering the NoteEditPage component */}
            <Route path="/editpage" element={<NoteEditPage />} />
            {/* on addnote route of react router we are rendering the AddNotePage component */}
            <Route path='/addnote' element={<AddNotePage />}></Route>
            {/* on viewnote route of react router we are rendering the ShowNotesPage component */}
            <Route path='/viewnote' element={<ShowNotesPage />}></Route>
            {/* on the application home route or root of the application of react router we are rendering the HomePage component */}
            <Route path="/" element={<HomePage />} />
            {/* on every other route of react router dom we are rendering the error page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </NotesContextProvider>
    </LoaderContextProvider>
  )
}

export default App
