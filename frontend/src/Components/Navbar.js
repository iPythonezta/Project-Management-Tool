import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './components.css'

export default function Navbar({ active }) {
    const navigate = useNavigate();
    return (
        <div className='navbar'>
            <h2 className='brand'>Project Management Tool</h2>
            <nav className='nav'>
                <Link to={'/'} className={active==='Home'?'active':''}>Home</Link>
                <Link to='/projects' className={active==='Projects'?'active':''}>Projects</Link>
                <Link to='/users' className={active==='Users'?'active':''}>Users</Link>
                <button className='login' onClick={() => navigate('/login')}>Login</button>
                <button className='register' onClick={() => navigate('/registeration')}>Register</button>
            </nav>
        </div>
    )
}

Navbar.defaultProps = {
    active: 'Home'
}