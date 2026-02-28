const express = require('express');
const { authMiddleware, requireRole } = require('../middlewares/auth');
const controller = require('../controllers/users.controller');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/me', authMiddleware, asyncHandler(controller.me)); // info del usuario autenticado
router.post('/login', asyncHandler(controller.loginUser)); // log in
router.post('/create', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.create)); //crear ususario

module.exports = { router };