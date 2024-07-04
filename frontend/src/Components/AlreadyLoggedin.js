import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function AlreadyLoggedin(){
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