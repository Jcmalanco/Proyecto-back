const express = require('express');
const controller = require('../controllers/boletas.controller');
const {asyncHandler} = require('../utils/asyncHandler');
const { authMiddleware, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, asyncHandler(controller.getAll));
router.get('/:id', authMiddleware, asyncHandler(controller.getById));
router.get('/cliente/:cliente_id', authMiddleware, asyncHandler(controller.getByCliente));
router.post('/', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.create));
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(controller.remove));

module.exports = { router };