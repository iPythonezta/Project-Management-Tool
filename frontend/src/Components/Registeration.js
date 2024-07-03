import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registeration() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [passwordValid, setPasswordValid] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState('This field is required');
    const [firstNameValid, setFirstNameValid] = React.useState(false);
    const [firstNameError, setFirstNameError] = React.useState('This field is required');
    const [lastNameValid, setLastNameValid] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState('This field is required');
    const [emailValid, setEmailValid] = React.useState(false);
    const [emailError, setEmailError] = React.useState('This field is required');
    const [errorMsg, setErrorMsg] = React.useState('');

    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        const uppercase = "(?=.*?[A-Z])";
        const lowercase = "(?=.*?[a-z])";
        const number = "(?=.*?[0-9])";
        const special = "(?=.*?[#?!@$%^&*-])";
        const minLength = ".{8,}";

        if (!e.target.value.match(uppercase)) {
            setPasswordError("Your password must contain at least one uppercase letter");
            setPasswordValid(false);
        } 
        else if (!e.target.value.match(lowercase)) {
            setPasswordError("Your password must contain at least one lowercase letter");
            setPasswordValid(false);
        } 
        else if (!e.target.value.match(number)) {
            setPasswordError("Your password must contain at least one number");
            setPasswordValid(false);
        } 
        else if (!e.target.value.match(special)) {
            setPasswordError("Your must contain at least one special character");
            setPasswordValid(false);
        } 
        else if (!e.target.value.match(minLength)) {
            setPasswordError("Your password must be at least 8 characters long");
            setPasswordValid(false);
        } 
        else {
            setPasswordError('');
            setPasswordValid(true);
        }
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        if (e.target.value == '') {
            setFirstNameError('First name is required');
            setFirstNameValid(false);
        } else {
            setFirstNameError('');
            setFirstNameValid(true);
        }
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
        if (e.target.value == '') {
            setLastNameError('Last name is required');
            setLastNameValid(false);
        } else {
            setLastNameError('');
            setLastNameValid(true);
        }
    }

    const handleEmailChange = (e) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(e.target.value);
        if (!e.target.value.match(emailRegex)) {
            setEmailError('Invalid email address');
            setEmailValid(false);
        } else {
            setEmailError('');
            setEmailValid(true);
        }
    }

    const handleRegisteration = async(e) => {
        e.preventDefault();
        if (firstNameValid && lastNameValid && emailValid && passwordValid) {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password
            })
            .then((response) => {
                console.log(response);  
                if (response.status == 201) {
                    localStorage.setItem('user', response.data);
                    navigate('/login');
                }
            })
            .catch((error) => {
                console.error(error);
            })
        }
    }

    return (
        <div className="container">
            <Navbar active={'Registeration'} />
            <h1 className='pg-heading reg-heading'>Registeration</h1>
            <p className="error-msg-muted">{errorMsg}</p>
            <main>
                <form className='form'>
                    <div className="form-content">
                        <label htmlFor="firstname" className="form-label">First Name</label>
                        <input required type="text" id="firstname" className={firstNameValid ? "form-input valid" : "form-input invalid"} value={firstName} onChange={handleFirstNameChange}  />
                        <p className="error-msg">{firstNameError}</p>
                        <label htmlFor="lastname" className="form-label" >Last Name</label>
                        <input required type="text" id="lastname" className={lastNameValid ? "form-input valid" : "form-input invalid"} value={lastName} onChange={handleLastNameChange} />
                        <p className="error-msg">{lastNameError}</p>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input required type="text" id="email" className={emailValid ? "form-input valid" : "form-input invalid"} value={email} onChange={handleEmailChange} />
                        <p className="error-msg">{emailError}</p>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input required type="password" id="password" className={passwordValid ? "form-input valid" : "form-input invalid"} value={password} onChange={handlePasswordChange} />
                        <p className="error-msg">{passwordError}</p>
                    </div>
                    <div className="form-submit">
                        <button onClick={handleRegisteration} className="form-button">Register</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    )
}