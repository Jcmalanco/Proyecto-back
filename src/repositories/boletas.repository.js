const { pool } = require('../db');

class BoletasRepository {

  async getAll({ page, limit }) { // Paginación de boletas
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      'SELECT * FROM boletas ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return rows;
  }

  async getById(id) { // Detalles de una boleta
    const { rows } = await pool.query(
      'SELECT * FROM boletas WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async getByClienteId(clienteId, { page, limit }) {// Paginación de boletas por cliente
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      'SELECT * FROM boletas WHERE cliente_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
      [clienteId, limit, offset]
    );
    return rows;
  }

  async create(data) {// Crear boleta
    const { rows } = await pool.query(
      `INSERT INTO boletas
       (cliente_id, descripcion, categoria, prestamo, interes, plazo_meses, estado,
        fecha_empeno, fecha_vencimiento, total_prestamo, total_pagado, saldo_pendiente)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        data.cliente_id,
        data.descripcion,
        data.categoria,
        data.prestamo,
        data.interes,
        data.plazo_meses,
        data.estado,
        data.fecha_empeno,
        data.fecha_vencimiento,
        data.total_prestamo,
        data.total_pagado,
        data.saldo_pendiente
      ]
    );
    return rows[0];
  }

  async remove(id) {// Cancelar boleta (no se elimina físicamente, cambia su estado a "cancelada")
    const res = await pool.query(
      'UPDATE boletas SET estado = $1 WHERE id = $2',
      ['cancelada', id]
    );
    return res.rowCount > 0;
  }

  async updatePago(id, montoPagado) {// Actualizar solo los campos relacionados con pagos
    const { rows } = await pool.query(
      `UPDATE boletas 
       SET total_pagado = total_pagado + $1,
           saldo_pendiente = saldo_pendiente - $1,
           estado = CASE 
             WHEN saldo_pendiente - $1 <= 0 THEN 'pagada' 
             ELSE estado 
           END
       WHERE id = $2
       RETURNING *`,
      [montoPagado, id]
    );
    return rows[0];
  }

  async getSaldoPendiente(id) {// Obtener solo el saldo pendiente de una boleta
    const { rows } = await pool.query(
      'SELECT saldo_pendiente FROM boletas WHERE id = $1',
      [id]
    );
    return rows[0]?.saldo_pendiente;
  }
}

module.exports = { BoletasRepository };