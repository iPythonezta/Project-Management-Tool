import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectContext } from '../Context/ProjectContext';
import './components.css'

export default function Navbar({ active }) {
    const navigate = useNavigate();
    const {setLogin, setToken, login,token, setUser} = useProjectContext();

    const handleLogout = async () => {
        console.log(token);
        const headers = {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/auth/delete-auth-token/', 
                { token: token }, 
                { headers: headers }
            );
            console.log('Logout successful:', response.data);
            navigate('/');
            setLogin(false);
            setToken('');
            setUser({});
        } catch (error) {
            console.error('Error during logout:', error.response ? error.response.data : error.message);
        }
    };
    
    
    return (
        <div className='navbar'>
                <h2 className='brand'>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        Project Management Tool
                    </Link> 
                </h2>
            <nav className='nav'>
                <Link to={'/'} className={active==='Home'?'active':''}>Home</Link>
                <Link to='/projects' className={active==='Projects'?'active':''}>Projects</Link>
                <Link to='/users' className={active==='Users'?'active':''}>Users</Link>
                {!login &&
                    (
                        <>
                            <button className='login' onClick={() => navigate('/login')}>Login</button>
                            <button className='register' onClick={() => navigate('/registeration')}>Register</button>
                        </>
                    )
                }
                {
                    login &&
                    (
                        <>
                        <button className='login' onClick={handleLogout}>LogOut</button>
                        <button className='register' style={{visibility:'hidden'}}></button>
                        </>
                    )
                }
            </nav>
        </div>
    )
}

Navbar.defaultProps = {
    active: 'Home'
}