import './App.css';
import Login from './Components/Login';
import Registeration from './Components/Registeration';
import Home from './Components/Home';
import Projects from './Components/Projects';
import {BrowserRouter, Routes, Route, json} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { useProjectContext } from './Context/ProjectContext';
import axios from 'axios';
import Tasks from './Components/Tasks';
import ProjectDetail from './Components/ProjectDetail';

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
      console.log(response.data);
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
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registeration' element={<Registeration />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/tasks' element={<Tasks />} />
        <Route path='/project/:id' element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
