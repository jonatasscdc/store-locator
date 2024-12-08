const path = require('path');
const fs = require('fs');

/**
 * Store Repository:
 * Handles reading store data from a JSON file.
 * In a real application, this might query a database.
 */

// Path to the JSON file containing store data
const dataPath = path.join(__dirname, '../../infrastructure/db/stores.json');

function getAllStores() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const stores = JSON.parse(raw);
  return stores;
}

module.exports = {
  getAllStores
};
