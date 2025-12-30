// hooks/useProjects.js - Hook for managing user projects
import { useState, useCallback } from "react";
import {
  saveProject,
  getUserProjects,
  getProject,
  deleteProject,
  duplicateProject,
  updateProjectDeployment,
} from "../utils/projects";

/**
 * Hook for managing user projects
 */
export function useProjects(userId) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  /**
   * Fetch user's projects
   */
  const fetchProjects = useCallback(
    async (options = {}) => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const { projects: data, total: count } = await getUserProjects(
          userId,
          options
        );
        setProjects(data);
        setTotal(count);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Save a project (create or update)
   */
  const save = useCallback(
    async ({ id, name, prompt, htmlContent, customization }) => {
      if (!userId) throw new Error("User not authenticated");

      const result = await saveProject({
        id,
        userId,
        name,
        prompt,
        htmlContent,
        customization,
      });

      // Update local state
      setProjects((prev) => {
        const existing = prev.findIndex((p) => p.id === result.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = result;
          return updated;
        }
        return [result, ...prev];
      });

      return result;
    },
    [userId]
  );

  /**
   * Delete a project
   */
  const remove = useCallback(
    async (id) => {
      if (!userId) throw new Error("User not authenticated");

      await deleteProject(id, userId);

      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    },
    [userId]
  );

  /**
   * Duplicate a project
   */
  const duplicate = useCallback(
    async (id) => {
      if (!userId) throw new Error("User not authenticated");

      const result = await duplicateProject(id, userId);

      // Update local state
      setProjects((prev) => [result, ...prev]);
      setTotal((prev) => prev + 1);

      return result;
    },
    [userId]
  );

  /**
   * Update deployment status
   */
  const markDeployed = useCallback(
    async (
      id,
      { deployedUrl, subdomain, vercelProjectId, vercelDeploymentId }
    ) => {
      if (!userId) throw new Error("User not authenticated");

      const result = await updateProjectDeployment(id, userId, {
        deployedUrl,
        subdomain,
        vercelProjectId,
        vercelDeploymentId,
      });

      // Update local state
      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = result;
          return updated;
        }
        return prev;
      });

      return result;
    },
    [userId]
  );

  /**
   * Get a single project
   */
  const get = useCallback(
    async (id) => {
      if (!userId) throw new Error("User not authenticated");
      return getProject(id, userId);
    },
    [userId]
  );

  return {
    projects,
    isLoading,
    error,
    total,
    fetchProjects,
    save,
    remove,
    duplicate,
    markDeployed,
    get,
  };
}

export default useProjects;
