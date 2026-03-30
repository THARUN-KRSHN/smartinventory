/**
 * Resolves a relative image path to an absolute URL using the configured API base URL.
 * Handles both uploaded file paths (starting with '/') and external URLs.
 * @param {string|null} path - The image path or URL
 * @returns {string|null}
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return path;
};

export default API_BASE;
