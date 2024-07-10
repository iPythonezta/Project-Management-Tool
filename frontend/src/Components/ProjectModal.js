import React, {useState} from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useProjectContext } from "../Context/ProjectContext";
export default function ProjectModal({setShow, fetcher}) {
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('In Progress');
    const [conditionalCSS, setConditionalCSS] = useState({
        statusColor:'#BA6A02',
    });

    const {token} = useProjectContext();

    const handleChangeColor = (e) => {
        setStatus(e.target.value);
        if (e.target.value === 'Completed') {
            setConditionalCSS({statusColor: '#01A41B'});
        }
        else if (e.target.value === 'In Progress') {
            setConditionalCSS({statusColor: '#BA6A02'});
        }
        else {
            setConditionalCSS({statusColor: 'black'});
        }
    }

    const handleAddProject = (e) => {
        e.preventDefault();
        const project = {
            title: projectTitle,
            description: projectDescription,
            start_date: startDate,
            end_date: endDate,
            status: status
        }
        console.log(project)

        axios.post('http://127.0.0.1:8000/api/projects/',project, {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
        .then((response) => {
            console.log(response.data);
            fetcher();
            setShow(false);
        })
        .catch((error) => {
            console.error(error);
        })
    }
        
    return (
        <div className="proj-modal">
            <div className="proj-modal-header">
                <div className="close-btn-container" onClick={() => setShow(false)}>
                    <IoMdClose className="close-btn"/>
                </div>
                <h2>Add Project</h2>
            </div>
            <div className="proj-modal-body">
                <form className="form proj-form">
                    <div className="form-content proj-content">
                        <label className="form-label" htmlFor="project-title">Project Title</label>
                        <input className="form-input" type="text" id="project-title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                        <label className="form-label" htmlFor="project-description">Project Description</label>
                        <textarea className="form-input" id="project-description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></textarea>
                        <label className="form-label" htmlFor="start-date">Start Date</label>
                        <input className="form-input" type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label className="form-label" htmlFor="end-date">End Date</label>
                        <input className="form-input" type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        <label className="form-label" htmlFor="status">Status</label>
                        <select id="status" value={status} style={{color: conditionalCSS?.statusColor}} onChange={(e) => {handleChangeColor(e);setStatus(e.target.value)}}>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className="proj-modal-footer">
                <button className="add-button" onClick={handleAddProject}>Add Project</button>
            </div>
        </div>
    )
}