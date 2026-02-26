const express = require('express');
const controller = require('../controllers/boletas.controller');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware, requireRole } = require('../middlewares/auth');

const router = express.Router();

// GET
router.get('/', authMiddleware, asyncHandler(controller.getAll));
router.get('/search', authMiddleware, asyncHandler(controller.search));
router.get('/:id', authMiddleware, asyncHandler(controller.getById));
// POST
router.post('/', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.create));
// PUT
router.put('/:id', authMiddleware, requireRole('admin', 'empleado'), asyncHandler(controller.update));
// DELETE
router.delete('/:id', authMiddleware, requireRole('admin'), asyncHandler(controller.remove));

module.exports = { router };