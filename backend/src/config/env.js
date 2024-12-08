require('dotenv').config();

/**
 * Environment configuration.
 * Load environment variables from .env file.
 */
module.exports = {
  port: process.env.PORT || 4000,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
};
