import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Registeration() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [passwordValid, setPasswordValid] = React.useState(true);
    const [passwordError, setPasswordError] = React.useState('');

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

    return (
        <div className="container">
            <Navbar active={'Registeration'} />
            <h1 className='pg-heading reg-heading'>Registeration</h1>
            <main>
                <form className='form'>
                    <div className="form-content">
                        <label htmlFor="firstname" className="form-label">First Name</label>
                        <input type="text" id="firstname" className="form-input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                        <label htmlFor="lastname" className="form-label" >Last Name</label>
                        <input type="text" id="lastname" className="form-input" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" id="email" className="form-input" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" className={password==""? "form-input" : passwordValid ? "form-input valid" : "form-input invalid"} value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-submit">
                        <button type="submit" className="form-button">Register</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    )
}