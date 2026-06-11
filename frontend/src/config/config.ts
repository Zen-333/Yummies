// frontend/src/config.ts

// This creates a single source of truth for your API URL
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://backend-production-40d8e.up.railway.app' 
  : 'http://localhost:5000'; // Ensure this matches your local backend port