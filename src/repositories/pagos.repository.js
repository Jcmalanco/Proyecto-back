const { pool } = require('../db');

class PagosRepository {

  async getNextNumeroPago(boleta_id) {
    const { rows } = await pool.query(
      'SELECT COALESCE(MAX(numero_pago), 0) as max FROM pagos WHERE boleta_id = $1',
      [boleta_id]
    );
    return Number(rows[0].max) + 1;
  }

  async createPago({ boleta_id, numero_pago, monto, metodo_pago }) {
    await pool.query(
      `INSERT INTO pagos
       (boleta_id, numero_pago, monto, fecha_pago, metodo_pago, creado_en)
       VALUES ($1, $2, $3, NOW(), $4, NOW())`,
      [boleta_id, numero_pago, monto, metodo_pago]
    );
  }

  async findPagosByBoletaId(boleta_id) {
    const { rows } = await pool.query(
      'SELECT * FROM pagos WHERE boleta_id = $1 ORDER BY numero_pago ASC',
      [boleta_id]
    );
    return rows;
  }
}

// EXPORTAS LA CLASE
module.exports = { PagosRepository };