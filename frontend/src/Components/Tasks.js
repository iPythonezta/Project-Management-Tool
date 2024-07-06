import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function Tasks() {
    return (
        <div>
            <Navbar active={'Tasks'} />
            <h2 className="pg-heading">
                Tasks
            </h2>
            <Footer />
        </div>
    )
}