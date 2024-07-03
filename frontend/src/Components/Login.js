import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
export default function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/auth/obtain-auth-token/', {
            username:username,
            password:password
        })
        .then((response) => {
            localStorage.setItem('token', response.data.token);
        })
        .catch((error) => {
            setError(error.response.data.message);
        })
    }
    return (
        <div className="container">
            <Navbar active={'Login'} />
            <h1 className='pg-heading'>Login</h1>
            <p className='error-msg'>{error}</p>
            <main>
                <form className='form'>
                    <div className="form-content">
                        <label htmlFor="username" className="form-label" value={username} onChange={(e)=>setUsername(e.target.value)}>Email</label>
                        <input type="text" id="username" className="form-input" />
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" className="form-input" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <div className="form-submit">
                        <button onClick={handleLogin} className="form-button">Login</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
        
    )
}