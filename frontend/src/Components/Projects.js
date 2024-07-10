import React from "react";
import { useProjectContext } from "../Context/ProjectContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectModal from "./ProjectModal";
export default function Projects() {
    return (
        <div>
            <Navbar active={'Projects'} />
            <h2 className="pg-heading">
                Projects
            </h2>
            <div className="button-justifier">
                <button className="gray-button">Add Project</button>
            </div>
            <div className="modal-container">
                <ProjectModal /> {/* For testing I will make it triggerable with a button later */}
            </div>
            <table className="proj-table" border={1}>
                <thead>
                    <tr>
                        <th colSpan={1}>ID</th>
                        <th colSpan={2}>Project Title</th>
                        <th colSpan={3}>Project Description</th>
                        <th colSpan={1.5}>Start Date</th>
                        <th colSpan={1.5}>End Date</th>
                        <th colSpan={1.5}>Created At</th>
                        <th colSpan={1.5}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={1}>1</td>
                        <td colSpan={2}>Testing Project Styling</td>
                        <td colSpan={3}>Styling the projects page....</td>
                        <td colSpan={1.5}>07/07/2024</td>
                        <td colSpan={1.5}>09/07/2024</td>
                        <td colSpan={1.5}>06/07/2023</td>
                        <td colSpan={1.5}>In Progress</td>
                    </tr>
                </tbody>
            </table>
            <Footer />
        </div>
    )
}