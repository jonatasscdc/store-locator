const express = require('express');
const cors = require('cors');
const storeRoutes = require('./interfaces/http/routes/storeRoutes');
const ApiError = require('./interfaces/errors/ApiError');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/stores', storeRoutes);

// Not found handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
