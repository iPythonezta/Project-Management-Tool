import React, {useState, useEffect} from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useProjectContext } from "../Context/ProjectContext";
export default function InviteModal({setShow, fetcher, project_id, setAlert, setAlertType, setLoading}) {
    const [email, setEmail] = useState('');
    const {token} = useProjectContext();

    const invitePerson = async() => {
        setLoading(true);
        await axios.post('http://127.0.0.1:8000/api/projects/invite/',{
            email: email,
            project_id: project_id,
        },{
            headers: {
                Authorization: `Token ${token}`
            },
        })
        .then((response)=>{
            console.log(response.data);
            fetcher();
            setShow(false);
            setAlertType('success');
            setAlert(`Successfully invited ${email} to collaborate on this project`);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error);
            setAlertType('danger');
            setAlert(error.response.data.error);
            setLoading(false);
        })
    }
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
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </form>
            </div>
            <div className="invite-modal-footer">
               <button className="add-button" onClick={(()=>{invitePerson()})}>Invite</button>
            </div>
        </div>
    )
}