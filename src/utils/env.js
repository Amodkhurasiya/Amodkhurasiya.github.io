/**
 * Utility to get environment variables from multiple sources
 * Priority: 
 * 1. import.meta.env (Vite)
 * 2. window.ENV (from index.html)
 * 3. Default values
 */

export const getEnv = (key, defaultValue) => {
  // Check Vite env vars first
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Check window.ENV next (set in index.html)
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  
  // Fall back to default
  return defaultValue;
};

// API URL Configuration
const BACKEND_URL = 'https://trybee-backend.railway.app';
const API_PATH = '/api';

// Use a CORS proxy if direct access fails - DISABLE for now since it's causing auth issues
const useCorsProxy = false; // Set to false for direct backend access

// CORS proxy options
const corsProxies = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://proxy.cors.sh/'
];

// Select a CORS proxy
const selectedProxy = corsProxies[0];

// Export the API URL
export const API_URL = useCorsProxy 
  ? `${selectedProxy}${BACKEND_URL}${API_PATH}` 
  : `${BACKEND_URL}${API_PATH}`;

// Export other environment variables
export const IS_PRODUCTION = window.location.hostname !== 'localhost';

// Export a configured axios instance
export const getApiBaseUrl = () => {
  return API_URL;
}; 