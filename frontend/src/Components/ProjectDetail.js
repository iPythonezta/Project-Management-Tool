import axios from "axios";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useProjectContext } from "../Context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { GoPencil } from "react-icons/go";

export default function ProjectDetail() {
    let {id} = useParams();
    const {token} = useProjectContext();
    const [project, setProject] = React.useState({});
    const navigate = useNavigate();
    const [percent, setPercent] = React.useState(80); {/* Will be calculated dynamically later when I implement tasks */}

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
        <div>
            <Navbar active="Projects" />
            <main>
                <h2 className="pg-heading">{project.title}</h2>
                <div className="project-container">
                    <div className="small-container">
                        <p className="small-detail-heading">Details</p>
                        <div className="edit-button-container">
                            <GoPencil />
                        </div>
                    </div>
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
                            <h3 className="project-title status-hd">Status</h3>
                            <div className="circular-progress-bar">
                                <CircularProgressbar value={percent} text={`${percent}%`} styles={buildStyles({pathColor: getDynamicColor()})} />
                            </div>
                            <div className="status-text-container">
                                <p className="status-info">6/10 Tasks Completed</p>
                                <p className="status-text">In Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}