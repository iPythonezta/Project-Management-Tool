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
import { MdDeleteOutline } from "react-icons/md";
import DeleteModal from "./DeleteModal";
import NotLoggedIn from "./NotLoggedIn";
import ProjectDetailSwitch from "./ProjectDetailSwitch";
import InviteModal from "./InviteModal";
export default function ProjectDetail() {
    let {id} = useParams();
    const {token, login} = useProjectContext();
    const [project, setProject] = React.useState({});
    const [percent, setPercent] = React.useState(0);
    const [show, setShow] = React.useState(false);
    const [tasks, setTasks] = React.useState([]);
    const [taskShow, setTaskShow] = React.useState(false);
    const [deleteShow, setDeleteShow] = React.useState(false);
    const [showMembers, setShowMembers] = React.useState(false);
    const [inviteShow, setInviteShow] = React.useState(false);
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

    const hanldeClickOutside = (e) => {
        if (e.target === e.currentTarget) {
          setShow(false);
          setTaskShow(false);
        }
    };

    const calculateProgress = () => {
        const totalWithoutCancelled = tasks.filter((task) => task.status !== 'Cancelled').length;
        if (totalWithoutCancelled === 0) {
            setPercent(0);
            return;
        }
        const completed = tasks.filter((task) => task.status === 'Completed').length;
        let progress = (completed / totalWithoutCancelled) * 100;
        progress = Math.round(progress)
        setPercent(progress);
    }

    const returnTasksData = () => {
        const totalWithoutCancelled = tasks.filter((task) => task.status !== 'Cancelled').length;
        const completed = tasks.filter((task) => task.status === 'Completed').length;
        const cancelled = tasks.filter((task) => task.status === 'Cancelled').length;
        return [completed, totalWithoutCancelled, cancelled];
    }

    useEffect(() => {
        fetchProjectData();
        fetchTasks();
    }, [token])

    useEffect(() => {
       if (show || taskShow || deleteShow){
            document.scrollingElement.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
       else {
           document.body.style.overflow = 'auto';
       }
       calculateProgress();
    })

    if (!login) {
        return <NotLoggedIn />
    }


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
            <div className={inviteShow===true?'modal-container show':'modal-container hide'}>
                <InviteModal />
            </div>
            
            <main className="container">
                <h2 className="pg-heading">{project.title}</h2>
                <p className="project-manager-details">
                    <p className="project-manager-name">
                        Project Manager:&nbsp;&nbsp;&nbsp;
                        <span className="name">
                            {project.manager_details?.first_name} {project.manager_details?.last_name}
                        </span>
                    </p>
                    <p className="project-manager-email">
                        <a href={`mailto:${project.manager_details?.email}`}>
                            ({project.manager_details?.email})
                        </a>
                    </p>
                </p>
                <ProjectDetailSwitch showMembers={showMembers} setShowMembers={setShowMembers} />
                {showMembers === false ? 
                    (    
                        <div>
                            <div className="project-container">
                                <div className="small-container">
                                    <p className="small-detail-heading">Details</p>
                                    <div className="edit-button-container">
                                        <GoPencil  onClick={() => setShow(true)}/>
                                        <MdDeleteOutline onClick={() => setDeleteShow(true)}/>
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
                                            <h5 className="status-info">{returnTasksData()[0]}/{returnTasksData()[1]} Tasks Completed</h5>
                                            <p className="status-info-desc">({returnTasksData()[2]} Tasks Cancelled)</p>
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
                                                    <tr key={task.id} className={getClassName(task.status)} onClick={() => navigate(`/task/${task.id}`)}>
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
                        </div>    
                    ):
                    (
                        <div>    
                            <h2 className="member-heading pg-heading">Project Members</h2>
                            <div className="btn-container">
                                <button className="gray-button member-btn">Invite Member</button>
                            </div>
                            <div className="member-container task-table-container">
                                <table className="member-table task-table">
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>First Name</th>
                                            <th colSpan={2}>Last Name</th>
                                            <th colSpan={2}>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            project?.members_details?.map((member) => (
                                                <tr key={member.id}>
                                                    <td colSpan={2}>{member.first_name}</td>
                                                    <td colSpan={2}>{member.last_name}</td>
                                                    <td colSpan={2}>{member.email}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            </main>
            <div className={taskShow===true?'modal-container show':'modal-container hide'} onClick={hanldeClickOutside}>
                <TaskModal setShow={setTaskShow} fetcher={fetchTasks} projectId={id}/>
            </div>
            {deleteShow && <DeleteModal setShow={setDeleteShow} navigate={navigate} id={id} />}
            
            <Footer />
        </div>
    )
}