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
  const [pendingAction, setPendingAction] = useState(null); // 'edit' | 'deploy'

  // Cached projects state
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

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

  // Fetch projects (only if not already fetched)
  const fetchProjects = useCallback(
    async (force = false) => {
      // Skip if already fetched and not forcing refresh
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

  // Force refresh projects (call after saving)
  const refreshProjects = useCallback(async () => {
    return fetchProjects(true);
  }, [fetchProjects]);

  // Remove a project from cache
  const removeProjectFromCache = useCallback((projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  // Add or update a project in cache
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
        // Existing
        pendingProject,
        pendingAction,
        editProject,
        deployProject,
        clearPendingProject,
        // New cached projects
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
