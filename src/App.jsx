import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ErrorPage from './pages/ErrorPage';
import Logout from './pages/Logout';
import { useEffect } from 'react';
import HttpRequestUtility from './utils/HttpRequestUtility';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path='/logout' element={<Logout/>}></Route>
        <Route path="/Login" element={<Login/>} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>;
    </>
  )
}

export default App
