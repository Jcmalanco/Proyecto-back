const { pool } = require('../db');

class BoletasRepository {

  async getAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      'SELECT * FROM boletas ORDER BY fecha_empeno DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return rows;
  }

  async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM boletas WHERE id = $1',
      [id]
    );

    return rows[0];
  }

  async searchByClienteNombre(nombre) {
    const { rows } = await pool.query(
      'SELECT b.* FROM boletas b JOIN clientes c ON c.id = b.cliente_id WHERE c.nombre ILIKE \'%\' || $1 || \'%\' ORDER BY b.fecha_empeno DESC',
      [nombre]
    );

    return rows;
  }

  async create(data) {
    const {
      cliente_id,
      descripcion,
      categoria,
      prestamo,
      interes,
      plazo_meses
    } = data;

    const { rows } = await pool.query(
      'INSERT INTO boletas (cliente_id, descripcion, categoria, prestamo, interes, plazo_meses, estado, fecha_empeno, fecha_vencimiento, total_prestamo, total_pagado, saldo_pendiente) VALUES ($1, $2, $3, $4, $5, $6, \'activa\', CURRENT_DATE, CURRENT_DATE + ($6 || \' months\')::INTERVAL, $4 + ($4 * $5 / 100), 0, $4 + ($4 * $5 / 100)) RETURNING *',
      [
        cliente_id,
        descripcion,
        categoria,
        prestamo,
        interes,
        plazo_meses
      ]
    );

    return rows[0];
  }

  async updatePago(id, monto) {
    const { rows } = await pool.query(
      'UPDATE boletas SET total_pagado = total_pagado + $1, saldo_pendiente = GREATEST(saldo_pendiente - $1, 0) WHERE id = $2 RETURNING *',
      [monto, id]
    );

    return rows[0];
  }

  async updateEstado(id, estado) {
    const { rows } = await pool.query(
      'UPDATE boletas SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    return rows[0];
  }

  async delete(id) {
    const res = await pool.query(
      'DELETE FROM boletas WHERE id = $1',
      [id]
    );

    return res.rowCount > 0;
  }
}

module.exports = { BoletasRepository };