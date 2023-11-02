import React from 'react'
import { useNavigate } from 'react-router-dom';
import HttpRequestUtility from '../utils/HttpRequestUtility';

const Logout = () => {

    const navigate = useNavigate();

    const logout = (event)=>{
        event.preventDefault();
        HttpRequestUtility.getAxiosInstance().post("http://localhost:8080/api/logout")
          navigate("/login")
    }
  return (
    <button onClick={logout}>logout</button>
  )
}

export default Logout