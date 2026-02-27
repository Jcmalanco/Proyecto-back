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
      'SELECT * FROM boletas WHERE id = $1 ORERDER BY fecha_empeno DESC',
      [id]
    );

    return rows[0];
  }

  async getByClienteId(clienteId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      'SELECT * FROM boletas WHERE cliente_id = $1 ORDER BY fecha_empeno DESC LIMIT $2 OFFSET $3',
      [clienteId, limit, offset]
    );
    return rows;
  }

  async create(data) {
    const {
      cliente_id,
      descripcion,
      categoria,
      prestamo,
      plazo_meses
    } = data;

    // interés según categoría
    const interesesPorCategoria = {
      'electronica': 8,
      'joyas': 5,
      'herramientas': 10,
      'vehiculos': 4,
      'ropa': 7,
      'general': 6
    };

    const interes = interesesPorCategoria[categoria?.toLowerCase()] || 6;

    // Calcular valores en JavaScript
    const prestamoNum = parseFloat(prestamo);
    const interesNum = parseFloat(interes);
    const plazoNum = parseInt(plazo_meses);
    
    const totalPrestamo = prestamoNum + (prestamoNum * interesNum / 100);
    const saldoPendiente = totalPrestamo;
    
    // Calcular fecha de vencimiento
    const fechaEmpeno = new Date();
    const fechaVencimiento = new Date(fechaEmpeno);
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoNum);
    
    // Formatear fechas para PostgreSQL (YYYY-MM-DD)
    const fechaEmpenoStr = fechaEmpeno.toISOString().split('T')[0];
    const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];

    const { rows } = await pool.query(
      `INSERT INTO boletas 
        (cliente_id, descripcion, categoria, prestamo, interes, plazo_meses, estado, 
         fecha_empeno, fecha_vencimiento, total_prestamo, total_pagado, saldo_pendiente) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        cliente_id,
        descripcion,
        categoria,
        prestamoNum,
        interesNum,
        plazoNum,
        'activa',
        fechaEmpenoStr,
        fechaVencimientoStr,
        totalPrestamo,
        0,
        saldoPendiente
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