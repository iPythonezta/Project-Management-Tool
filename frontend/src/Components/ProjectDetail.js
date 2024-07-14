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
import TaskModal from "./TasksModal";

export default function ProjectDetail() {
    let {id} = useParams();
    const {token} = useProjectContext();
    const [project, setProject] = React.useState({});
    const [percent, setPercent] = React.useState(80); {/* Will be calculated dynamically later when I implement tasks */}
    const [show, setShow] = React.useState(false);
    const [tasks, setTasks] = React.useState([]);
    const [taskShow, setTaskShow] = React.useState(false);
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

    const fetchTasks = async () => {
        await axios.get(`http://127.0.0.1:8000/api/tasks/?project_id=${id}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then((response)=>{ 
            setTasks(response.data)
            console.log(response.data)
        })
        .catch((error) => {
            console.error(error);
        })
    }

    const getClassName = (status) => {
        if (status === 'In Progress') {
            console.log('progress');
            return 'progress';
        } 
        else if (status === 'Completed') {
            return 'completed';
        } 
        else if (status === 'Delayed') {
            return 'delayed';
        }
        else if (status === 'Cancelled') {
            return 'cancelled';
        }
        else {
            return '';
        }
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
        fetchTasks();
    }, [token])

    useEffect(() => {
       if (show || taskShow){
            document.scrollingElement.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
       else {
           document.body.style.overflow = 'auto';
       }
    })


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
                <h2 className="pg-heading">Project Tasks</h2>
                <div className="task-container">
                    <div className="btn-container">
                        <button className="task-btn gray-button" onClick={()=>setTaskShow(true)}>Add Task</button>
                    </div>
                    <div className="task-table-container">
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th colSpan={1}>ID</th>
                                    <th colSpan={2}>Task Title</th>
                                    <th colSpan={3}>Task Description</th>
                                    <th colSpan={2}>Start Date</th>
                                    <th colSpan={2}>End Date</th>
                                    <th colSpan={2}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.map((task) => (
                                        <tr key={task.id} className={getClassName(task.status)}>
                                            <td colSpan={1}>{task.id}</td>
                                            <td colSpan={2}>{task.title}</td>
                                            <td colSpan={3}>{task.description}</td>
                                            <td colSpan={2}>{task.start_date}</td>
                                            <td colSpan={2}>{task.end_date}</td>
                                            <td colSpan={2}>{task.status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
            <div className={taskShow===true?'modal-container show':'modal-container hide'}>
                <TaskModal setShow={setTaskShow} fetcher={fetchTasks} projectId={id}/>
            </div>
            
            <Footer />
        </div>
    )
}