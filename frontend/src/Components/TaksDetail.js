import axios, { all } from "axios";

import { useState, useEffects, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useProjectContext } from "../Context/ProjectContext";

import Navbar from "./Navbar";
import Footer from "./Footer";
import NotLoggedIn from "./NotLoggedIn";

import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function TaskDetail () {
    const {id} = useParams();
    const {token, login} = useProjectContext();
    const [task, setTask] = useState({});
    const [allTasks, setAllTasks] = useState([]);
    const [percent, setPercent] = useState(0);

    const fetchTasks = async (id) => {
        await axios.get(`http://127.0.0.1:8000/api/tasks/?project_id=${id}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then((response)=>{ 
            setAllTasks(response.data)
        })
        .catch((error) => {
            console.error(error);
        }
        )
    }

    const fetchTaskData = async() => {
        await axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setTask(res.data);
            fetchTasks(res.data.project.id);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const returnTasksData = () => {
        const totalWithoutCancelled = allTasks.filter((task) => task.status !== 'Cancelled').length;
        const completed = allTasks.filter((task) => task.status === 'Completed').length;
        const cancelled = allTasks.filter((task) => task.status === 'Cancelled').length;
        return [completed, totalWithoutCancelled, cancelled];
    }

    const calculateProgress = () => {
        const totalWithoutCancelled = allTasks.filter((task) => task.status !== 'Cancelled').length;
        if (totalWithoutCancelled === 0) {
            setPercent(0);
            return;
        }
        const completed = allTasks.filter((task) => task.status === 'Completed').length;
        let progress = (completed / totalWithoutCancelled) * 100;
        progress = Math.round(progress)
        setPercent(progress);
        console.log(progress);
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
        fetchTaskData();
        fetchTasks();
    }, [token])

    useEffect(() => {
        calculateProgress();
    }, [allTasks])

    if (!login) {
        return <NotLoggedIn />
    }
    return (
        <div className="page-container">
            <Navbar />
            <div className="container task-detail-container">
                <div className="main-body">
                    <header>
                        <h1 className="pg-heading">{task?.project?.title}</h1>
                        <p className="pg-heading-secondary">({task?.title})</p>
                    </header>
                    <div className="task-container">
                        <div className="small-container">
                            <p className="small-detail-heading">Details</p>
                            <div className="edit-button-container">
                                <GoPencil  />
                                <MdDeleteOutline />
                            </div>
                        </div>
                        <div className="task-info-container">
                            <div className="task-info">
                                <h3 className="task-title task-hd">{task?.title}</h3>
                                <p className="task-description">{task?.description}</p>
                                <div className="task-footer">
                                    <p><strong>Started At: </strong>{task?.start_date}</p>
                                    <p><strong>End Date: </strong>{task?.end_date}</p>
                                </div>
                            </div>

                            <div className="status-container">
                                
                            </div>
                    </div>
                    </div>
                </div>
                <aside className="proj-sidebar">
                    <h2 className="sidebar-heading pg-heading">Project Info</h2>
                    <p className="sidebar-desc">{task?.project?.description}</p>
                    <div className="circular-container">
                        <CircularProgressbar value={percent} text={`${percent}%`} styles={buildStyles({
                            textColor: '#000',
                            pathColor: getDynamicColor(),
                        })} />
                    </div>
                    <h5 className="status-sidebar">{task?.project?.status}</h5>
                    <h5 className="status-sidebar-info">{returnTasksData()[0]}/{returnTasksData()[1]} Tasks Completed</h5>
                    <p className="status-sidebar-info-desc">({returnTasksData()[2]} Tasks Cancelled)</p>
                </aside>
            </div>
            <Footer />
        </div>
    )
}