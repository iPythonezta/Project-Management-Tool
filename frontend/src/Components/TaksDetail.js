import axios, { all } from "axios";

import { useState, useEffects, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectContext } from "../Context/ProjectContext";

import Navbar from "./Navbar";
import Footer from "./Footer";
import NotLoggedIn from "./NotLoggedIn";
import DeleteModal from "./DeleteModal";
import TaskModal from "./TasksModal";

import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { MdTimeline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { RiCheckDoubleLine } from "react-icons/ri";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function TaskDetail () {
    const {id} = useParams();
    const {token, login} = useProjectContext();
    const [task, setTask] = useState({});
    const [allTasks, setAllTasks] = useState([]);
    const [percent, setPercent] = useState(0);
    const [show, setShow] = useState(false);
    const [taskShow, setTaskShow] = useState(false);
    const navigate = useNavigate();

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

    const markAs  = async(mark) => {
        await axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            status: mark
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            fetchTaskData();
        })
        .catch(err => {
            console.log(err);
        })
    }

    const hanldeClickOutside = (e) => {
        if (e.target === e.currentTarget) {
          setShow(false);
          setTaskShow(false);
        }
    };

    const handleTaskShow = () => {
        setTaskShow(true);
    }

    useEffect(() => {
        fetchTaskData();
    }, [token])

    useEffect(() => {
        calculateProgress();
    }, [allTasks])

    useEffect(() => {
        if (show || taskShow){
            document.scrollingElement.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
       else {
           document.body.style.overflow = 'auto';
       }
    })

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
                                <GoPencil  onClick={handleTaskShow}/>
                                <MdDeleteOutline onClick={() => setShow(true)} />
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
                                <h3 className="project-title status-hd">Status</h3>
                                <div className="task-progress-indicator">
                                    {
                                        task.status === 'Completed' ? <FaCheck className="status-icon" style={{color: '#006400' }} /> : 
                                        task.status === 'In Progress' ? <MdTimeline className="status-icon" style={{color: '#8b8500' }} /> : 
                                        task.status === 'Delayed' ? <MdOutlineAccessTime className="status-icon" style={{color: '#805e80'}} /> : 
                                        task.status === 'Cancelled' ? <MdOutlineCancel className="status-icon" style={{color: '#97002b'}} /> : 
                                        task.status === 'Pending' ? <GiPauseButton className="status-icon" style={{color: '#32c5c5'}} /> : null
                                    }
                                </div>
                                <div className="status-text-container">
                                    <h5 className="task-status-text status-text"
                                        style={
                                            task.status === 'Completed' ? {color: '#006400', opacity:0.5} :
                                            task.status === 'In Progress' ? {color: '#8b8500', opacity:0.5} :
                                            task.status === 'Delayed' ? {color: '#805e80', opacity:0.5} : 
                                            task.status === 'Cancelled' ? {color: '#97002b', opacity:0.5} : 
                                            task.status === 'Pending' ? {color: '#32c5c5', opacity:0.5} : null
                                        }
                                    >{task.status}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="task-actions-container">
                        {task.status !== 'In Progress' && <button className="progress-btn" onClick={() => markAs('In Progress')}><RiCheckDoubleLine /> Mark as Active</button>}
                        {task.status !== 'Pending' && <button className="not-started-btn" onClick={() => markAs('Pending')}><RiCheckDoubleLine /> Mark as Not Started</button>}
                        {task.status !== 'Cancelled' && <button className="cancel-btn" onClick={() => markAs('Cancelled')}><RiCheckDoubleLine /> Mark as Cancelled</button>}
                        {task.status !== 'Delayed' && <button className="delay-btn" onClick={() => markAs('Delayed')}><RiCheckDoubleLine /> Mark as Delayed</button>}
                        {task.status !== 'Completed' && <button className="completed-btn" onClick={() => markAs('Completed')}><RiCheckDoubleLine /> Mark As Completed</button>}
                    </div>
                    <div className="task-instructions-container">
                        <h2 className="pg-heading">Task Instructions</h2>
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
            <div className="modal-section">
                <div className={taskShow===true?'modal-container show':'modal-container hide'} onClick={hanldeClickOutside}>
                    <TaskModal
                        title= {task?.title}
                        description = {task?.description}
                        start= {task?.start_date}
                        end= {task?.end_date}
                        status_= {task?.status}
                        id= {task?.id}
                        edit= {true}
                        setShow={setTaskShow} 
                        fetcher={()=> {
                            fetchTaskData();
                            fetchTasks();
                        }} 
                        projectId={task?.project?.id}
                    />
                </div>
                {show && <DeleteModal setShow={setShow} id={task.id} task={true} navigate={navigate} projId={task.project.id}/>}
            </div>
        </div>
    )
}