import React from "react";
import { useProjectContext } from "../Context/ProjectContext";
import axios from "axios";

export default function DeleteModal({ setShow, navigate, id })  {
    const {token} = useProjectContext();
    const hanldeDeleteProject = async() => {
        await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
            navigate('/');
        })
        .catch((error) => {
            console.error(error);
        })
    }

    const hanldeClickOutside = (e) => {
        if (e.target === e.currentTarget) {
          setShow(false);
        }
    };

    return (
        <div className="modal-container-delete" onClick={hanldeClickOutside}>
            <div className="modal-content-delete">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this project?</p>
                <div className="delete-btn-container">
                    <button className="btn btn-confirm" onClick={hanldeDeleteProject}>
                        Confirm
                    </button>
                    <button className="btn btn-cancel" onClick={() => setShow(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}