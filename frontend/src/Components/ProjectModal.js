import React from "react";
import { IoMdClose } from "react-icons/io";
export default function ProjectModal() {
    return (
        <div className="proj-modal">
            <div className="proj-modal-header">
                <div className="close-btn-container">
                    <IoMdClose className="close-btn"/>
                </div>
                <h2>Add Project</h2>
            </div>
            <div className="proj-modal-body">

            </div>
            <div className="proj-modal-footer">
                <button className="add-button">Add Project</button>
            </div>
        </div>
    )
}