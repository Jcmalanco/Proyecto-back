const { BoletasRepository } = require('../repositories/boletas.repository');
const { validarBoleta, validarCancelacion  } = require('../domain/boletas.rules');

const repo = new BoletasRepository();

const getAll = async (req, res) => { // Paginación
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await repo.getAll({ page, limit });
  res.json({ page, limit, count: data.length, data });
};

const getById = async (req, res) => { // Detalles de una boleta
  const boleta = await repo.getById(req.params.id);
  if (!boleta) return res.status(404).json({ error: 'Boleta no encontrada' });
  res.json(boleta);
};

const getByCliente = async (req, res) => { // Paginación de boletas por cliente
  const cliente_id = Number(req.params.cliente_id);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await repo.getByClienteId(cliente_id, { page, limit });
  res.json({ cliente_id: cliente_id, data });
};

const create = async (req, res) => {// Crear boleta
  const validation = validarBoleta(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const boleta = await repo.create(validation.data);
  res.status(201).json(boleta);
};

const remove = async (req, res) => {
  const { id } = req.params;
  
  // 1. Obtener la boleta
  const boleta = await repo.getById(id);
  
  // 2. Validar si se puede cancelar (usando rules)
  const validacion = await validarCancelacion(boleta);
  if (validacion.error) {
    return res.status(400).json({ error: validacion.error });
  }
  
  // 3. Proceder a cancelar
  const deleted = await repo.remove(id);
  if (!deleted) {
    return res.status(500).json({ error: 'Error al cancelar la boleta' });
  }
  
  res.json({ message: 'Boleta cancelada correctamente' });
};

module.exports = {getAll, getById, getByCliente, create, remove};