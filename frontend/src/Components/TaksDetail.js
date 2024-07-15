import axios from "axios";

import { useState, useEffects, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../Context/ProjectContext";

import Navbar from "./Navbar";
import Footer from "./Footer";
import NotLoggedIn from "./NotLoggedIn";

export default function TaskDetail () {
    const {id} = useParams();
    const {token, login} = useProjectContext();
    const [task, setTask] = useState({});
    const [project, setProject] = useState({});

    const fetchTaskData = async() => {
        await axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setTask(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchTaskData();
    }, [token])

    if (!login) {
        return <NotLoggedIn />
    }
    return (
        <div className="page-container">
            <Navbar />
            <div className="container task-detail-container">
                <div className="main-body">
                    <header>
                        <h1 className="pg-heading">{task.project.title}</h1>
                        <p className="pg-heading-secondary">({task.title})</p>
                    </header>
                </div>
                <aside className="proj-sidebar">
                    <h2 className="sidebar-heading pg-heading">Project Info</h2>
                </aside>
            </div>
            <Footer />
        </div>
    )
}