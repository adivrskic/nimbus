import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { supabase } from "../lib/supabaseClient";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [pendingProject, setPendingProject] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const editProject = useCallback((project) => {
    setPendingProject(project);
    setPendingAction("edit");
  }, []);

  const clearPendingProject = useCallback(() => {
    setPendingProject(null);
    setPendingAction(null);
  }, []);

  const fetchProjects = useCallback(
    async (force = false) => {
      if (hasFetchedRef.current && !force) {
        return projects;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "get-projects",
          {
            body: {},
          }
        );

        if (error) throw error;

        const fetchedProjects = data.projects || [];
        setProjects(fetchedProjects);
        hasFetchedRef.current = true;
        return fetchedProjects;
      } catch (err) {
        console.error("Error fetching projects:", err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [projects]
  );

  const refreshProjects = useCallback(async () => {
    return fetchProjects(true);
  }, [fetchProjects]);

  const removeProjectFromCache = useCallback((projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const updateProjectInCache = useCallback((project) => {
    setProjects((prev) => {
      const existing = prev.findIndex((p) => p.id === project.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = project;
        return updated;
      }
      return [project, ...prev];
    });
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        pendingProject,
        pendingAction,
        editProject,
        clearPendingProject,
        projects,
        isLoading,
        hasFetched: hasFetchedRef.current,
        fetchProjects,
        refreshProjects,
        removeProjectFromCache,
        updateProjectInCache,
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
