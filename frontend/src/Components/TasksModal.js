import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useProjectContext } from "../Context/ProjectContext";

export default function TaskModal({ setShow, fetcher, title, description, start, end, status_, id, edit, projectId }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [lengthError, setLengthError] = useState(false);
    const [conditionalCSS, setConditionalCSS] = useState({ statusColor: '#BA6A02' });

    const { token } = useProjectContext();

    const handleTaskDescription = (e) => {
        setTaskDescription(e.target.value);
        setLengthError(e.target.value.length > 400);
    };

    const handleChangeColor = (e) => {
        setStatus(e.target.value);
        const colorMap = {
            'Completed': 'palegreen',
            'In Progress': '#F3EC78',
            'Cancelled': '#AF4261',
            'Delayed': '#805e80'
        };
        setConditionalCSS({ statusColor: colorMap[e.target.value] || 'black' });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const task = {
            project: projectId,
            title: taskTitle,
            description: taskDescription,
            start_date: startDate,
            end_date: endDate,
            status: status,
        };

        axios.post('http://127.0.0.1:8000/api/tasks/', task, {
            headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
            console.log(response.data);
            fetcher();
            setShow(false);
            setTaskTitle("");
            setTaskDescription("");
            setStartDate("");
            setEndDate("");
            setStatus("");

        })
        .catch((error) => {
            console.error(error);
        });
    };

    const handleEditTask = (e) => {
        e.preventDefault();
        const task = {
            title: taskTitle,
            description: taskDescription,
            start_date: startDate,
            end_date: endDate,
            status: status,
        };

        axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, task, {
            headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
            console.log(response.data);
            fetcher();
            setShow(false);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        setTaskTitle(title);
        setTaskDescription(description);
        setStartDate(start);
        setEndDate(end);
        setStatus(status_);
    }, [title, description, start, end, status_]);


    return (
        <div className="task-modal">
            <div className="task-modal-header">
                <div className="close-btn-container" onClick={() => {
                    setTaskTitle("");
                    setTaskDescription("");
                    setStartDate("");
                    setEndDate("");
                    setStatus("");
                    setShow(false);
                }}>
                    <IoMdClose className="close-btn" />
                </div>
                <h2>{edit ? 'Edit Task' : 'Add Task'}</h2>
            </div>
            <div className="task-modal-body">
                <form className="form task-form">
                    <div className="form-content task-content">
                        <label className="form-label" htmlFor="task-title">Task Title</label>
                        <input className="form-input" type="text" id="task-title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                        <label className="form-label" htmlFor="task-description">Task Description</label>
                        <textarea className="form-input" id="task-description" value={taskDescription} onChange={handleTaskDescription}></textarea>
                        <p className="error-msg modal-error">{lengthError && 'Task Description cannot be longer than 400 characters'}</p>
                        <label className="form-label" htmlFor="start-date">Start Date</label>
                        <input className="form-input" type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label className="form-label" htmlFor="end-date">End Date</label>
                        <input className="form-input" type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <label className="form-label" htmlFor="status">Status</label>
                        <select id="status" value={status} style={{ color: conditionalCSS.statusColor,  }} onChange={handleChangeColor}>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Pending">Not Yet Started</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className="task-modal-footer">
                {!edit ? <button className="add-button" onClick={handleAddTask}>Add Task</button> : <button className="add-button" onClick={handleEditTask}>Edit Task</button>}
            </div>
        </div>
    );
}

TaskModal.defaultProps = {
    title: '',
    description: '',
    start: '',
    end: '',
    status_: 'In Progress',
    id: 1,
    edit: false,
    projectId: null,
};
