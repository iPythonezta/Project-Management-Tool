import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectModal from "./ProjectModal";
import { useProjectContext } from "../Context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function ProjectDetail() {
    let {id} = useParams();
    const {token} = useProjectContext();
    const [project, setProject] = React.useState({});
    const navigate = useNavigate();

    const fetchProjectData = async() => {
        await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setProject(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchProjectData();
    }, [token])

    return(
        <div>
            <Navbar active="Projects" />
            <main>
                <h2 className="pg-heading">{project.title}</h2>
                <div className="project-container">
                    <p className="small-detail-heading">Details</p>
                    <div className="project-info-container">
                        <div className="project-info">
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="proj-footer">
                                <p><strong>Started At: </strong>{project.start_date}</p>
                                <p><strong>End Date: </strong>{project.end_date}</p>
                                <p><strong>Created At: </strong>{new Date(project.created_at).toDateString()}</p>
                            </div>
                        </div>

                        <div className="status-container">

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}