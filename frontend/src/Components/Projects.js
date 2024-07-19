import React, { useEffect } from "react";
import { useProjectContext } from "../Context/ProjectContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectModal from "./ProjectModal";
import axios from "axios";
import NotLoggedIn from "./NotLoggedIn";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";

export default function Projects() {
    const [show, setShow] = React.useState(false);
    const [projects, setProjects] = React.useState([]);
    const {token, login} = useProjectContext();
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    
    const handleFetchProjects = () =>{
        setLoading(true);
        axios.get('http://127.0.0.1:8000/api/projects/',{
            headers: {
                Authorization: `Token ${token}`
            },
        })
        .then(res => {
            setProjects(res.data);
            console.log(res.data);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const hanldeClickOutside = (e) => {
        if (e.target === e.currentTarget) {
          setShow(false);
        }
    };

    
    useEffect(() => {
        handleFetchProjects();
    }, [token])

    if (!login) {
        return <NotLoggedIn />
    }

    return (
        <div className="page-container">
            <Navbar active={'Projects'} />
            <div className="container">
                <h2 className="pg-heading">
                    Projects
                </h2>
                <div className="button-justifier">
                    <button className="gray-button" onClick={() => setShow(true)}>Add Project</button>
                </div>
                <div className={show===true?'modal-container show':'modal-container hide'} onClick={hanldeClickOutside}>
                    <ProjectModal setShow={setShow} fetcher={handleFetchProjects}/>
                </div>
                <table className="proj-table" border={1}>
                    <thead>
                        <tr>
                            <th colSpan={1}>ID</th>
                            <th colSpan={2}>Project Title</th>
                            <th colSpan={3}>Project Description</th>
                            <th colSpan={2}>Start Date</th>
                            <th colSpan={2}>End Date</th>
                            <th colSpan={1.5}>Created At</th>
                            <th colSpan={1.5}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id} onClick={() => navigate(`/project/${project.id}`)}>
                                <td colSpan={1}>{project.id}</td>
                                <td colSpan={2}>{project.title}</td>
                                <td colSpan={3}>{project.description}</td>
                                <td colSpan={2}>{project.start_date}</td>
                                <td colSpan={2}>{project.end_date}</td>
                                <td colSpan={1.5}>{new Date(project.created_at).toDateString()}</td>
                                <td colSpan={1.5} style={project.status === 'Completed' ? {color: '#01A41B'} : project.status === 'In Progress' ? {color: '#BA6A02'} : {}}>{project.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    )
}