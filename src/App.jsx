import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ErrorPage from './pages/ErrorPage';
import Logout from './pages/Logout';
import HomePage from './pages/HomePage';
import useFavicon from './hooks/useFavicon';
import LightFavIcon from "./assets/note-nexus-favicon-white.svg"
import DarkFavIcon from "./assets/note-nexus-favicon-black.svg"
import NoteEditPage from './pages/NoteEditPage';
import ShowNotesPage from './pages/ShowNotesPage';

function App() {

  useFavicon(DarkFavIcon, LightFavIcon)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path='/logout' element={<Logout />}></Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/editpage" element={<NoteEditPage />} />
          <Route path="/test" element={<ShowNotesPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
