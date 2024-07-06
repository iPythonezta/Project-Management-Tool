import Navbar from "./Navbar"
import Footer from "./Footer"
import NotLoggedIn from "./NotLoggedIn";
import { useProjectContext } from "../Context/ProjectContext";
import { IoIosLaptop } from "react-icons/io";

export default function Home() {
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
                        <div className="card">
                            <div className="left-side">
                                <div>
                                    <IoIosLaptop className="card-icon" />
                                    <h5 className="card-heading">Projects</h5>
                                </div>
                            </div>
                            <div className="right-side">
                                
                            </div>
                        </div>
                        <div className="card">
                            <div className="left-side">
                                <IoIosLaptop className="card-icon" />
                            </div>
                            <div className="right-side">
                                
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}
       
