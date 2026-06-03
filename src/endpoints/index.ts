export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://webserver.pakistancables.com:8091/api";

export const ENDPOINTS = {
  activeJobs: `${API_BASE_URL}/job-operations/jobs/active`,
} as const;
