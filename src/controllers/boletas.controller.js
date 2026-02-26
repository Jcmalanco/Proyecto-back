// controllers/boletas.controller.js
const {BoletasRepository} = require('../repositories/boletas.repository');
const { validarBoleta } = require('../domain/boletas.rules');

const repo = new BoletasRepository();

// Obtener todas las boletas
async function getAll(req, res) {
  try {
    const boletas = await repo.getAll();
    return res.json(boletas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener boletas' });
  }
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
      nombre_cliente,
      descripcion,
      categoria,
      prestamo,
      plazo_meses
    } = req.body;

    // Validación y lógica de negocio
    const resultado = validarBoleta({
      nombre_cliente,
      descripcion,
      categoria,
      prestamo,
      plazo_meses
    });

    if (resultado.error) {
      return res.status(400).json(resultado.error);
    }

    // Guardar en base de datos
    const nuevaBoleta = await repo.create(resultado.data);

    return res.status(201).json(nuevaBoleta);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear boleta' });
  }
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

module.exports = {
  getAll,
  getById,
  create,
  remove
};