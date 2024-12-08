import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { Store, LocalGroceryStore, Devices } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const storeIcons = {
  grocery: <LocalGroceryStore />,
  electronics: <Devices />,
};

function StoreList({ stores = [] }) {
  return (
    <List sx={{ p: 0 }}>
      <AnimatePresence>
        {(!stores || stores.length === 0) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Store sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No stores found
              </Typography>
            </Box>
          </motion.div>
        ) : (
          stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem
                component={Paper}
                elevation={1}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {storeIcons[store.type] || <Store />}
                      <Typography variant="subtitle1" component="span">
                        {store.name}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={store.type}
                        size="small"
                        color={store.type === 'grocery' ? 'success' : 'info'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {store.address}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < stores.length - 1 && <Divider sx={{ mx: 1 }} />}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </List>
  );
}

export default StoreList;
