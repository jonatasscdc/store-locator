import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

/**
 * MapContainer:
 * - Initializes Google Maps
 * - Places markers for stores and user location
 */
function MapContainer({ stores = [], userLocation, darkMode }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Google Maps Script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      script.onerror = (e) => {
        console.error('Error loading Google Maps:', e);
        setError('Failed to load Google Maps');
      };
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      setMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;
    
    try {
      if (!mapInstanceRef.current) {
        initMap();
      }
    } catch (error) {
      console.error('Error updating map:', error);
      setError('Error updating map');
    }
  }, [mapsLoaded]);

  function createMarkerContent(store, isDark) {
    const div = document.createElement('div');
    div.className = 'marker-content';
    div.style.cssText = `
      background-color: ${isDark ? '#424242' : '#ffffff'};
      color: ${isDark ? '#ffffff' : '#000000'};
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      font-size: 14px;
      font-weight: 500;
      min-width: 100px;
      text-align: center;
      border: 2px solid ${getStoreTypeColor(store.type)};
    `;
    div.textContent = store.name;
    return div;
  }

  function createInfoWindowContent(store, isDark) {
    return `
      <div style="padding: 16px; min-width: 200px; color: ${isDark ? '#ffffff' : '#000000'}">
        <h3 style="margin: 0 0 8px 0; color: ${isDark ? '#ffffff' : '#000000'}">${store.name}</h3>
        <p style="margin: 0 0 4px 0; color: ${isDark ? '#cccccc' : '#666666'}">${store.address}</p>
        ${store.openNow !== undefined ? `
          <p style="margin: 0 0 4px 0; color: ${store.openNow ? '#4caf50' : '#f44336'}">
            ${store.openNow ? 'Open Now' : 'Closed'}
          </p>
        ` : ''}
        ${store.rating ? `
          <p style="margin: 0; color: ${isDark ? '#cccccc' : '#666666'}">
            Rating: ${store.rating} ⭐ (${store.userRatingsTotal} reviews)
          </p>
        ` : ''}
      </div>
    `;
  }

  function createUserMarkerContent() {
    const div = document.createElement('div');
    div.style.cssText = `
      width: 24px;
      height: 24px;
      background-color: #4285F4;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `;
    return div;
  }

  function getStoreTypeColor(type) {
    switch (type) {
      case 'grocery': return '#4CAF50';
      case 'electronics': return '#2196F3';
      case 'restaurant': return '#F44336';
      case 'cafe': return '#795548';
      case 'pharmacy': return '#9C27B0';
      default: return '#757575';
    }
  }

  function initMap() {
    if (!window.google?.maps) return;
    
    try {
      const defaultCenter = userLocation || { lat: -23.5505, lng: -46.6333 }; // São Paulo as default
      const mapOptions = {
        center: defaultCenter,
        zoom: 13,
        styles: darkMode ? darkMapStyles : [],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapId: process.env.REACT_APP_GOOGLE_MAP_ID || 'store-locator-map-id'
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Wait for the map to be idle before adding markers
      map.addListener('idle', () => {
        if (stores && stores.length > 0) {
          stores.forEach(store => {
            const markerView = new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat: store.lat, lng: store.lng },
              title: store.name,
              content: createMarkerContent(store, darkMode),
            });

            markerView.addListener('click', () => {
              const infoWindow = new window.google.maps.InfoWindow({
                content: createInfoWindowContent(store, darkMode),
                pixelOffset: new window.google.maps.Size(0, -10),
              });

              infoWindow.open({
                anchor: markerView,
                map,
              });
            });

            markersRef.current.push(markerView);
          });
        }

        if (userLocation) {
          const userMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position: userLocation,
            title: 'Your Location',
            content: createUserMarkerContent(),
          });
          markersRef.current.push(userMarker);
        }
      });
    } catch (error) {
      console.error('Error in initMap:', error);
      setError('Error initializing map');
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!mapsLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'background.paper',
            padding: 3,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <CircularProgress />
          <Box>Loading map...</Box>
        </Box>
      )}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'background.paper',
            padding: 3,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Box>Error: {error}</Box>
        </Box>
      )}
    </Box>
  );
}

export default MapContainer;
