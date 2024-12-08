import React, { useState } from 'react';
import { Box, Paper, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MapContainer from '../components/MapContainer';
import StoreFilters from '../components/StoreFilters';
import StoreList from '../components/StoreList';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import useFetchStores from '../hooks/useFetchStores';
import { geocodeAddress } from '../services/googleMapsApi';

/**
 * HomePage:
 * - Fetches stores from the API
 * - Manages filters
 * - Integrates location-based search
 */
function HomePage() {
  const [filterType, setFilterType] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);
  const { stores, loading, error } = useFetchStores(filterType);
  const { darkMode, toggleDarkMode } = useCustomTheme();

  React.useEffect(() => {
    // Request user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  React.useEffect(() => {
    if (stores) {
      setFilteredStores(stores);
    }
  }, [stores]);

  const handleFilterChange = (newType) => {
    setFilterType(newType);
  };

  const handleSearchLocation = async (address) => {
    if (!address) return;
    try {
      const coords = await geocodeAddress(address);
      if (coords) {
        setUserLocation(coords);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const handleUseCurrentLocation = (coords) => {
    setUserLocation(coords);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Locator
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, flex: 1, display: 'flex', gap: 2, overflow: 'hidden' }}>
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StoreFilters
            onFilterChange={handleFilterChange}
            onSearchLocation={handleSearchLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
          
          <Paper 
            elevation={3} 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              mt: 2
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '2rem', textAlign: 'center' }}
                >
                  <Typography>Loading stores...</Typography>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '2rem', textAlign: 'center' }}
                >
                  <Typography color="error">{error}</Typography>
                </motion.div>
              ) : (
                <StoreList stores={filteredStores} />
              )}
            </AnimatePresence>
          </Paper>
        </Box>

        <Paper elevation={3} sx={{ flex: 1 }}>
          <MapContainer
            stores={filteredStores}
            userLocation={userLocation}
            darkMode={darkMode}
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default HomePage;
