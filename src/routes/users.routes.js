const express = require('express');
const controller = require('../controllers/users.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();


router.get('/boletas', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.getBoletasByUser));
// Login
router.post('/login', asyncHandler(controller.loginUser));
// Crear usuario (solo admin)
router.post('/create', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.create));

module.exports = { router };