import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
export default function NotLoggedIn(){
    const navigate = useNavigate();
    return (
        <div className="container">
            <Navbar />
            <div className="">
                <h2 className="pg-heading">You must be logged in to access this page</h2>
                <p className="hd-desc">Please login or register for a new account</p>
                <div className="button-container">
                    <button className='login' onClick={() => navigate('/login')}>Login</button>
                    <button className='register' onClick={() => navigate('/registeration')}>Register</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}