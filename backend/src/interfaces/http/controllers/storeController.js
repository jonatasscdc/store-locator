const Joi = require('joi');
const storeService = require('../../../domain/services/storeService');
const ApiError = require('../../errors/ApiError');

/**
 * Controller for store-related endpoints.
 * It handles request validation, calls services, and responds to the client.
 */

/**
 * Get all stores (optionally filtered by type) near the user's location.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStores(req, res, next) {
  try {
    const schema = Joi.object({
      type: Joi.string()
        .optional()
        .valid('all', 'grocery', 'electronics', 'restaurant', 'cafe', 'pharmacy')
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { type } = value;
    const effectiveType = type === 'all' ? undefined : type;
    
    // Get client's IP address
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.socket.remoteAddress;
               
    const result = await storeService.getStores(effectiveType, ip);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStores
};
