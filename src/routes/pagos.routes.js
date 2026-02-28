const express = require('express');
const controller = require('../controllers/pagos.controller');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/create', asyncHandler(controller.crear));
router.post('/verify', asyncHandler(controller.verificar));

module.exports = { router };