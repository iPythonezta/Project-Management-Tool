import React, {useState, useEffect} from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useProjectContext } from "../Context/ProjectContext";
export default function InviteModal({setShow, fetcher}) {
    const [email, setEmail] = useState('');
    const {token} = useProjectContext();

        
    return (
        <div className="invite-modal">
            <div className="invite-modal-header">
                <div className="close-btn-container" onClick={() => setShow(false)}>
                    <IoMdClose className="close-btn"/>
                </div>
                <h2>Invite Member</h2>
            </div>
            <div className="invite-modal-body">
                <form className="form proj-form">
                    <div className="form-content proj-content">
                        <label className="form-label" htmlFor="project-title">Email</label>
                        <input className="form-input" type="text" id="project-title" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </form>
            </div>
            <div className="invite-modal-footer">
               <button className="add-button" onClick={(()=>{})}>Invite</button>
            </div>
        </div>
    )
}