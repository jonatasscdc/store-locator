import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

/**
 * Fetch stores from the API, optionally filtered by type.
 * @param {string} type 
 * @returns {Promise<Array>}
 */
export async function fetchStores(type) {
  const params = {};
  if (type && type !== 'all') {
    params.type = type;
  }
  const response = await axios.get(`${API_URL}/stores`, { params });
  return response.data.data;
}
