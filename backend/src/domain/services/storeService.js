const storeRepository = require('../repositories/storeRepository');
const locationService = require('./locationService');
const ApiError = require('../../interfaces/errors/ApiError');

/**
 * Store Service:
 * Contains the business logic. For now, it simply returns all stores.
 * Additional filtering, sorting, or location-based queries would be implemented here.
 */

/**
 * Retrieve all stores. Optionally filter by type and location.
 * @param {string} [type] - Filter by store type.
 * @param {string} ip - User's IP address to determine location.
 * @returns {Object} - Stores and user location.
 */
async function getStores(type, ip) {
  try {
    const location = await locationService.getLocationFromIP(ip);
    const stores = await locationService.getNearbyStores(location, type);
    return {
      stores,
      userLocation: {
        lat: location.lat,
        lng: location.lng,
        city: location.city,
        country: location.country
      }
    };
  } catch (error) {
    console.error('Error in getStores:', error);
    throw new ApiError(500, 'Error fetching stores');
  }
}

module.exports = {
  getStores
};
