const geoip = require('geoip-lite');
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY
});

// Default location for development (you can adjust these coordinates)
const DEFAULT_LOCATION = {
  lat: -23.5505,  // São Paulo coordinates
  lng: -46.6333,
  city: 'São Paulo',
  country: 'Brazil'
};

async function getLocationFromIP(ip) {
  try {
    // Handle localhost/development environment
    if (ip === '::1' || ip === '127.0.0.1' || ip.includes('localhost')) {
      return DEFAULT_LOCATION;
    }

    const geo = geoip.lookup(ip);
    if (!geo) {
      return DEFAULT_LOCATION;
    }

    // Get more precise location using Google Geocoder
    const results = await geocoder.geocode({
      city: geo.city,
      country: geo.country
    });

    if (results.length === 0) {
      return DEFAULT_LOCATION;
    }

    return {
      lat: results[0].latitude,
      lng: results[0].longitude,
      city: results[0].city,
      country: results[0].country
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return DEFAULT_LOCATION;
  }
}

async function getNearbyStores(location, type = '') {
  try {
    const radius = process.env.PLACES_API_RADIUS || 5000;
    const types = type === 'grocery' ? 'supermarket' : 
                 type === 'electronics' ? 'electronics_store' :
                 type === 'restaurant' ? 'restaurant' :
                 type === 'cafe' ? 'cafe' :
                 type === 'pharmacy' ? 'pharmacy' :
                 'supermarket|electronics_store|restaurant|cafe|pharmacy';

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: radius,
          type: types,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (!response.data.results) {
      throw new Error('No results found');
    }

    return response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      type: getStoreType(place.types),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.map(photo => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    throw error;
  }
}

function getStoreType(types) {
  if (types.includes('supermarket')) return 'grocery';
  if (types.includes('electronics_store')) return 'electronics';
  if (types.includes('restaurant')) return 'restaurant';
  if (types.includes('cafe')) return 'cafe';
  if (types.includes('pharmacy')) return 'pharmacy';
  return 'other';
}

module.exports = {
  getLocationFromIP,
  getNearbyStores
};
