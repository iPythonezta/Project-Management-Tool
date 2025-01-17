import axios, { all } from "axios";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectContext } from "../Context/ProjectContext";

import Navbar from "./Navbar";
import Footer from "./Footer";
import NotLoggedIn from "./NotLoggedIn";
import DeleteModal from "./DeleteModal";
import TaskModal from "./TasksModal";
import LoadingComponent from "./LoadingComponent";

import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { MdTimeline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { RiCheckDoubleLine } from "react-icons/ri";
import { AiOutlineSend } from 'react-icons/ai';
import { MdAttachFile } from 'react-icons/md';
import { FaFile } from "react-icons/fa";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function TaskDetail () {
    const {id} = useParams();
    const {token, login, user} = useProjectContext();
    const [task, setTask] = useState({});
    const [allTasks, setAllTasks] = useState([]);
    const [percent, setPercent] = useState(0);
    const [show, setShow] = useState(false);
    const [taskShow, setTaskShow] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [file, setFile] = useState(null);
    const [instructions , setInstructions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useRef();
    const websocketRef = useRef(null);

    const fetchTasks = async (id) => {
        setLoading(true);
        await axios.get(`http://127.0.0.1:8000/api/tasks/?project_id=${id}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then((response)=>{ 
            setAllTasks(response.data)
            setLoading(false);
        })
        .catch((error) => {
            console.error(error);
            setLoading(false);
        }
        )
    }

    const fetchTaskData = async() => {
        setLoading(true);
        await axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setTask(res.data);
            fetchTasks(res.data.project.id);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
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

    const handleSendMessage = async() => {
        const formData = new FormData();
        formData.append('message', inputMessage);
        if (file) {
            formData.append('attachment', file);
        }
        formData.append('user', user.email);
        formData.append('task_id', task.id);
        await axios.post(`http://127.0.0.1:8000/api/instructions/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setInputMessage('');
            setFile(null);
            fetchTaskData();
        })
        .catch(err => {
            console.log(err);
        })
    }

    const fetchInstructions = async() => {
        await axios.get(`http://127.0.0.1:8000/api/instructions/?task_id=${id}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            setInstructions(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchTaskData();
        fetchInstructions();    
    }, [token])

    useEffect(() => {
        calculateProgress();
    }, [allTasks])

    useEffect(() => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }

        const webSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);

        webSocket.onopen = () => {
            console.log('Connected');
        }

        websocketRef.current = webSocket;

        webSocket.onmessage = (msg) => {
            console.log(msg);
            const data = JSON.parse(msg.data);
            console.log("Message:- ")
            console.log(data.message);
            setInstructions((prev) => [...prev, data.message]);
            scrollRef.current.scrollIntoView({ behavior: 'smooth'});
        }

        return () => {
            webSocket.close();
        }
    }, [id])

    useEffect(() => {
        if (show || taskShow){
            document.scrollingElement.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
       else {
           document.body.style.overflow = 'auto';
       }
       fetchInstructions();
    },[])

    if (!login) {
        return <NotLoggedIn />
    }

    if (loading) {
        return <LoadingComponent />
    }
    return (
        <div className="page-container">
            <Navbar active={'Projects'} />
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
                        <h2 className="pg-heading">Task Discussion</h2>
                        <div className="chat-container">
                            <div className="messages-container">
                                {
                                    instructions.map((instruction, index) => (
                                        <div className={instruction.user_details.email === user.email ? "message" : "message message-received"} key={index}>
                                            <div className="message-header">
                                                {instruction.user_details.first_name} {instruction.user_details.last_name}
                                            </div>
                                            <p>
                                                {instruction.message}
                                            </p>
                                            <div className="attachment-container">
                                                {instruction.attachment && (
                                                    <div className="attachment">
                                                        <a href={instruction.attachment} download>View Attachment</a>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="timestamp">{new Date(instruction.created_at).toDateString() + " " + new Date(instruction.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="message-input-container" style={{marginTop:'30px'}}>
                                <textarea 
                                    value={inputMessage} 
                                    onChange={(e) => setInputMessage(e.target.value)} 
                                />
                                <label htmlFor="file-input">
                                    <MdAttachFile className="attach-icon" />
                                </label>
                                <input 
                                    id="file-input" 
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    onChange={(e) => {
                                        console.log(e.target.files[0]);
                                        setFile(e.target.files[0])
                                    }} 
                                />
                                <button className="send-button" onClick={handleSendMessage}>
                                    <AiOutlineSend />
                                </button>
                            </div>
                            {file && (
                                <div className="attached-file">
                                    <span className="remove-file" onClick={() => setFile(null)}>×</span>
                                    <FaFile className="file-icon" />
                                    <div className="file-name-container">
                                        <span className="file-name">{file.name}</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef}></div>
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