import './App.css';
import Login from './Components/Login';
import Registeration from './Components/Registeration';
import {BrowserRouter, Routes, Route, json} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { useProjectContext } from './Context/ProjectContext';
import axios from 'axios';

function App() {
  const {setUser, setLogin, setToken} = useProjectContext();
  const verify = async() => {
    const token = localStorage.getItem('token');
    await axios.get('http://127.0.0.1:8000/api/auth/me/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then((response) => {
      setUser(response.data);
      setLogin(true);
      setToken(token);
    })
    .catch((error) => {
      console.error(error);
    })
  }
  useEffect(() => {
    verify()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/registeration' element={<Registeration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
