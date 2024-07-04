import Navbar from "./Navbar"
import Footer from "./Footer"
import NotLoggedIn from "./NotLoggedIn";
import { useProjectContext } from "../Context/ProjectContext";
export default function Home() {
    const {login} = useProjectContext();
    if (!login) {
        return <NotLoggedIn />
    }
    
    return (
        <div className="container">
            <Navbar active={'Home'} />
            <div className="home-container">
                <main>
                    <h1 className="pg-heading">Welcome to Project Management Tool</h1>
                    <p className="hd-desc">Manage your projects and users efficiently</p>
                </main>
            </div>
            <Footer />
        </div>
    )
}
       
