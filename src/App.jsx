import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ErrorPage from './pages/ErrorPage';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>;
    </>
  )
}

export default App
