import axios from "axios";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useProjectContext } from "../Context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { GoPencil } from "react-icons/go";
import ProjectModal from "./ProjectModal";

export default function ProjectDetail() {
    let {id} = useParams();
    const {token} = useProjectContext();
    const [project, setProject] = React.useState({});
    const navigate = useNavigate();
    const [percent, setPercent] = React.useState(80); {/* Will be calculated dynamically later when I implement tasks */}
    const [show, setShow] = React.useState(false);

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

    const getDynamicColor = () => {
        if (percent >= 90) {
            return '#00ae00';
        }
        else if (percent >= 80) {
            return '#9ed300';
        } 
        else if (percent >= 60) {
            return '#f6ff00';
        } 
        else if (percent >= 30) {
            return '#ff5500';
        } 
        else {
            return '#ff2200';
        }

    }

    useEffect(() => {
        fetchProjectData();
    }, [token])
    

    return(
        <div className="project-details-container page-container">
            <Navbar active="Projects" />
            <div className={show===true?'modal-container show':'modal-container hide'}>
                <ProjectModal 
                    setShow={setShow} 
                    fetcher={fetchProjectData} 
                    title={project.title} 
                    description={project.description} 
                    start={project.start_date} 
                    end={project.end_date}
                    status_={project.status}
                    edit={true}
                    id={project.id}
                />
            </div>
            <main className="container">
                <h2 className="pg-heading">{project.title}</h2>
                <div className="project-container">
                    <div className="small-container">
                        <p className="small-detail-heading">Details</p>
                        <div className="edit-button-container" onClick={() => setShow(true)}>
                            <GoPencil />
                        </div>
                    </div>
                    <div className="project-info-container">
                        <div className="project-info">
                            <h3 className="project-title proj-hd">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="proj-footer">
                                <p><strong>Started At: </strong>{project.start_date}</p>
                                <p><strong>End Date: </strong>{project.end_date}</p>
                                <p><strong>Created At: </strong>{new Date(project.created_at).toDateString()}</p>
                            </div>
                        </div>

                        <div className="status-container">
                            <h3 className="project-title status-hd">Status</h3>
                            <div className="circular-progress-bar">
                                <CircularProgressbar value={percent} text={`${percent}%`} styles={buildStyles({pathColor: getDynamicColor()})} />
                            </div>
                            <div className="status-text-container">
                                <h5 className="status-info">6/10 Tasks Completed</h5>
                                <h5 className="status-text">{project.status}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}