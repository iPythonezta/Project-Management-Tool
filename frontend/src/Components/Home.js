import Navbar from "./Navbar"
import Footer from "./Footer"
import NotLoggedIn from "./NotLoggedIn";
import { useProjectContext } from "../Context/ProjectContext";
import { IoIosLaptop } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export default function Home() {
    const navigate = useNavigate();
    const {login} = useProjectContext();
    if (!login) {
        return <NotLoggedIn />
    }
    
    return (
        <div className="container">
            <Navbar active={'Home'} />
            <div className="home-container">
                <header>
                    <h3 className="home-heading">
                        Your All-in-One Project Management Tool for Seamless Collaboration and Success
                    </h3>
                </header>
                <main>
                    <div className="card-container">
                        <div className="card" onClick={() => navigate('/projects')}>
                            <div className="left-side">
                                <div>
                                    <IoIosLaptop className="card-icon" />
                                    <h5 className="card-heading">Projects</h5>
                                </div>
                            </div>
                            <div className="right-side">
                                <div>
                                    <p className="card-desc">
                                        Keep track of your progress across various projects and ensure each one is 
                                        completed efficiently and on schedule.
                                    </p>
                                    <div className="button-container">
                                        <button className="card-button" onClick={() => navigate('/projects')}>Manage</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card" onClick={() => navigate('/tasks')}>
                            <div className="left-side">
                                <BsListTask className="card-icon" />
                                <h5 className="card-heading">Tasks</h5>
                            </div>
                            <div className="right-side">
                                <div>
                                    <p className="card-desc">
                                        Track, manage, and update your progress in the various tasks assigned to you, 
                                        ensuring all deadlines are met!.
                                    </p>
                                    <div className="button-container">
                                        <button className="card-button" onClick={() => navigate('/tasks')}>Manage</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}
       
