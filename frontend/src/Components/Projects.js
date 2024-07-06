import React from "react";
import { useProjectContext } from "../Context/ProjectContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Projects() {
    return (
        <div>
            <Navbar active={'Projects'} />
            <h2 className="pg-heading">
                Projects
            </h2>
            <Footer />
        </div>
    )
}