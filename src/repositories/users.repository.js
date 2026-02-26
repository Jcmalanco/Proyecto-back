const { pool } = require('../db');

class UsersRepository {

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    return rows[0];
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, telefono, role, created_at FROM users WHERE id = $1`,
      [id]
    );

    return rows[0];
  }

  async getAll() {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, telefono, role, created_at FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

  async create(data) {
    const {
      nombre,
      email,
      telefono,
      password,
      role
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO users (nombre, email, telefono, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, telefono, role, created_at`,
      [
        nombre,
        email,
        telefono,
        password,
        role
      ]
    );
    return rows[0];
  }
}

module.exports = { UsersRepository };