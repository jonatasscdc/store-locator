const express = require('express');
const { getStores } = require('../controllers/storeController');
const router = express.Router();

/**
 * Routes for /stores
 */
router.get('/', getStores);

module.exports = router;
