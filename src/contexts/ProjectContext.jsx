import { createContext, useContext, useState, useCallback } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [pendingProject, setPendingProject] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // 'edit' | 'deploy'

  const editProject = useCallback((project) => {
    console.log("ProjectContext: editProject called", project?.id);
    setPendingProject(project);
    setPendingAction("edit");
  }, []);

  const deployProject = useCallback((project) => {
    console.log("ProjectContext: deployProject called", project?.id);
    setPendingProject(project);
    setPendingAction("deploy");
  }, []);

  const clearPendingProject = useCallback(() => {
    setPendingProject(null);
    setPendingAction(null);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        pendingProject,
        pendingAction,
        editProject,
        deployProject,
        clearPendingProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

export default ProjectContext;
