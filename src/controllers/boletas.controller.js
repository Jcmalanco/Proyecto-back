// controllers/boletas.controller.js
const {BoletasRepository} = require('../repositories/boletas.repository');
const { validarBoleta } = require('../domain/boletas.rules');

const repo = new BoletasRepository();

// Obtener todas las boletas
async function getAll(req, res) {
  let { page, limit } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: 'Parámetros de paginación inválidos'
    });
  }

  const boletas = await repo.getAll({ page, limit });
  return res.json({
    page,
    limit,
    count: boletas.length,
    data: boletas
  });
}

// Obtener boleta por ID
async function getById(req, res) {
  try {
    const { id } = req.params;
    const boleta = await repo.getById(id);

    if (!boleta) {
      return res.status(404).json({ error: 'Boleta no encontrada' });
    }

    return res.json(boleta);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener boleta' });
  }
}

// Crear nueva boleta

async function create(req, res) {
  try {
    const {
      cliente_id,
      descripcion,
      categoria,
      prestamo,
      plazo_meses
    } = req.body;

    const validation = validarBoleta({ 
      cliente_id, 
      descripcion, 
      categoria, 
      prestamo, 
      plazo_meses 
    });
    
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { data } = validation;

    const boleta = await repo.create({
      cliente_id: data.cliente_id,
      descripcion: data.descripcion,
      categoria: data.categoria,
      prestamo: data.prestamo,
      plazo_meses: data.plazo_meses
    });

    return res.status(201).json({
      ok: true,
      boleta
    });
  } catch (error) {
    console.error('Error al crear boleta:', error);
    return res.status(500).json({ error: 'Error al crear boleta' });
  }
}

async function getByCliente(req, res) {
  const clienteId = Number(req.params.clienteId);
  let { page, limit } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  if (!Number.isInteger(clienteId)) {
    return res.status(400).json({ error: 'cliente_id inválido' });
  }

  const boletas = await repo.getByClienteId(clienteId, { page, limit });

  return res.json({
    cliente_id: clienteId,
    page,
    limit,
    total: boletas.length,
    data: boletas
  });
}
// Eliminar boleta
async function remove(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await repo.remove(id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Boleta no encontrada' });
    }

    return res.json({ message: 'Boleta eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar boleta' });
  }
}

  module.exports = { getAll, getById, getByCliente, create, remove};