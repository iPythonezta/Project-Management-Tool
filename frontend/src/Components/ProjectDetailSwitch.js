import './switch.css'
export default function ProjectDetailSwitch({showMembers, setShowMembers}) {
    return (
        <div className="project-switch-container">
            <div className={showMembers===false?'switch-button active':'switch-button'} onClick={() => setShowMembers(false)}>
                Project Details
            </div>
            <div className={showMembers===true?'switch-button active':'switch-button'} onClick={() => setShowMembers(true)}>
                Members
            </div>
        </div>
    )
}