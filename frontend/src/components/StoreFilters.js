import React, { useState } from 'react';
import {
  Paper,
  TextField,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Tooltip,
  Button,
  Typography
} from '@mui/material';
import {
  Search,
  MyLocation,
  LocalGroceryStore,
  Devices,
  Restaurant,
  LocalCafe,
  LocalPharmacy,
  ShoppingBag
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const STORE_TYPES = [
  { value: 'all', label: 'All', icon: <ShoppingBag /> },
  { value: 'grocery', label: 'Grocery', icon: <LocalGroceryStore /> },
  { value: 'electronics', label: 'Electronics', icon: <Devices /> },
  { value: 'restaurant', label: 'Restaurant', icon: <Restaurant /> },
  { value: 'cafe', label: 'Cafe', icon: <LocalCafe /> },
  { value: 'pharmacy', label: 'Pharmacy', icon: <LocalPharmacy /> },
];

function StoreFilters({ onFilterChange, onSearchLocation, onUseCurrentLocation }) {
  const [address, setAddress] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
      onFilterChange(newType);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (address.trim()) {
      onSearchLocation(address);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onUseCurrentLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter location or address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
          />
          <Tooltip title="Search location">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{
                minWidth: '120px',
                height: '40px',
                whiteSpace: 'nowrap',
                px: 2,
                '& .MuiButton-startIcon': {
                  marginRight: '4px',
                },
                fontSize: '0.875rem',
              }}
            >
              Search
            </Button>
          </Tooltip>
          <Tooltip title="Use current location">
            <IconButton
              color="primary"
              onClick={handleCurrentLocation}
              sx={{ ml: 1 }}
            >
              <MyLocation />
            </IconButton>
          </Tooltip>
        </Box>

        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={handleTypeChange}
          aria-label="store type"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButton-root': {
              flex: '1 1 auto',
              minWidth: 100,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:hover': {
                border: '1px solid rgba(0, 0, 0, 0.24)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  border: '1px solid',
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                },
              },
            },
          }}
        >
          {STORE_TYPES.map((type) => (
            <ToggleButton
              key={type.value}
              value={type.value}
              aria-label={type.label}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1,
                borderRadius: '4px !important',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                },
                '&.Mui-selected': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
              }}
            >
              {type.icon}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {type.label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>
    </motion.div>
  );
}

export default StoreFilters;
