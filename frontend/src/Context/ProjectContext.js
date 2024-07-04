import React, { useContext, createContext } from "react";

export const ProjectContext = createContext();

export default function ProjectContextProvider({ children }) {
    const [login, setLogin] = React.useState(false);
    const [token, setToken] = React.useState('');
    const [user, setUser] = React.useState({});
    return (
        <ProjectContext.Provider value={{login, setLogin, token, setToken, user, setUser}}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProjectContext = () => useContext(ProjectContext)