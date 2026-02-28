const { pool } = require('../db');

class UsersRepository {

  async findByEmail(email) {// Buscar usuario por email (para login)
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  async findById(id) {// Buscar usuario por ID (para mostrar info sin password)
    const { rows } = await pool.query(
      'SELECT id, nombre, email, telefono, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  async getAll() {// Listar todos los usuarios (sin password)
    const { rows } = await pool.query(
      'SELECT id, nombre, email, telefono, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  async create(data) {// Crear usuario
    const { rows } = await pool.query(
      `INSERT INTO users (nombre, email, telefono, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, telefono, role, created_at`,
      [
        data.nombre,
        data.email,
        data.telefono,
        data.password,
        data.role
      ]
    );

    return rows[0];
  }
}

module.exports = { UsersRepository };