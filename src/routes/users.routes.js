const express = require('express');
const controller = require('../controllers/users.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();
// Login
router.post('/login', asyncHandler(controller.loginUser));
router.get('/me', authMiddleware, asyncHandler(controller.me));

// Crear usuario (solo admin)
router.post('/create', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.create));

module.exports = { router };