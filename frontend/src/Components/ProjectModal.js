import React, {useState} from "react";
import { IoMdClose } from "react-icons/io";
export default function ProjectModal({setShow}) {
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('In Progress');
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
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className="proj-modal-footer">
                <button className="add-button">Add Project</button>
            </div>
        </div>
    )
}