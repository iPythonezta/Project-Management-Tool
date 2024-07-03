import axios from 'axios';
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './components.css'

export default function Navbar({ active }) {
    return (
        <div className='navbar'>
            <h2 className='brand'>Project Management Tool</h2>
            <nav className='nav'>
                <a href='/' className={active==='Home'?'active':''}>Home</a>
                <a href='/projects' className={active==='Projects'?'active':''}>Projects</a>
                <a href='/users' className={active==='Users'?'active':''}>Users</a>
                <button className='login'>Login</button>
                <button className='register'>Register</button>
            </nav>
        </div>
    )
}

Navbar.defaultProps = {
    active: 'Home'
}