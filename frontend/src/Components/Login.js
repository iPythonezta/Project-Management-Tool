import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { useProjectContext } from "../Context/ProjectContext";
export default function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [usernameValid, setUsernameValid] = React.useState(false);
    const [passwordValid, setPasswordValid] = React.useState(false);
    const [emailError, setEmailError] = React.useState('This field is required');
    const [passwordError, setPasswordError] = React.useState('This field is required');
    const {login, setLogin, token, setToken} = useProjectContext();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e.target.value)) {
            setUsernameValid(false);
            setEmailError('Please enter a valid email address');
        }
        else {
            setUsernameValid(true);
            setEmailError('');
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value === '') {
            setPasswordValid(false);
            setPasswordError('This field is required');
        }
        else if (e.target.value.length < 8) {
            setPasswordValid(false);
            setPasswordError('Password must be at least 8 characters long');
        }
        else {
            setPasswordValid(true);
            setPasswordError('');
        }
    }

    const handleLogin = async(e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (username === '' || password === '' || !emailRegex.test(username)) {
            setError("All fields are required");
            if (!emailRegex.test(username)) {
                setUsernameValid(false);
                setEmailError('Please enter a valid email address');
            }

            if (password === '') {
                setPasswordValid(false);
                setPasswordError('This field is required');
            }
            else if (password.length < 8) {
                setPasswordValid(false);
                setPasswordError('Password must be at least 8 characters long');
            }
            return
        }
        setUsernameValid(true); 
        setPasswordValid(true);
        
        const data = new FormData();
        console.log(username, password);
        data.append('username', username);
        data.append('password', password);
        await axios.post('http://127.0.0.1:8000/api/auth/obtain-auth-token/', data)
        .then((response) => {
            localStorage.setItem('token', response.data.token);
            setLogin(true);
            setToken(response.data.token);
        })
        .catch((error) => {
            setError("Email or password is incorrect");
        })
    }

    if (login) {
        return (
            <div className="container">
                <Navbar />
                <div className="login-info-container">
                    <h2 className="pg-heading">You are already logged in!</h2>
                    <p className="hd-desc">Click <Link to='/'>here</Link> to go to the home page</p>
                </div>
                <Footer />
            </div>
        )
    }
    return (
        <div className="container">
            <Navbar active={'Login'} />
            <h1 className='pg-heading'>Login</h1>
            <p className='error-msg-login'>{error}</p>
            <main>
                <form className='form'>
                    <div className="form-content">
                        <label htmlFor="username" className="form-label" value={username}>Email</label>
                        <input type="text" id="username" required={true} className={usernameValid ? "form-input valid" : "form-input invalid"} value={username} onChange={handleUsernameChange}/>
                        <p className="error-msg">{emailError}</p>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" required={true} className={passwordValid ? "form-input valid" : "form-input invalid"} value={password} onChange={handlePasswordChange} />
                        <p className="error-msg">{passwordError}</p>
                    </div>
                    <div className="form-submit">
                        <button onClick={handleLogin} className="form-button">Login</button>
                    </div>
                </form>
                <p className='form-footer'>Don't have an account? <Link to='/registeration'>Register</Link></p>
            </main>
            <Footer />
        </div>
        
    )
}