const bcrypt = require('bcryptjs');
const { sign } = require('../middlewares/auth');
const { validarUsuario } = require('../domain/users.rules');
const { UsersRepository } = require('../repositories/users.repository');
const { EmailDup } = require('../middlewares/error.middleware');

const repo = new UsersRepository();

// Login de usuario
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) { // si no hay email o password
    return res.status(400).json({ error: 'Email y password requeridos' });
  }

  const user = await repo.findByEmail(email); // busca por email

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const ok = await bcrypt.compare(password, user.password); // compara password

  if (!ok) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = sign({
    id: user.id,
    role: user.role
  });// genera token

  return res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      role: user.role
    }// devuelve token y datos del usuario
  });
}

async function getBoletasByUser(req, res) {
  const userId = req.user.id;

  try {
    const boletas = await repo.getBoletasByUserId(userId);
    return res.json(boletas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener boletas del usuario' });
  }
}

async function me(req, res) {
  return res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
}

// Crear usuario
async function create(req, res) {
  try {
    const {
      nombre,
      email,
      password,
      telefono,
      role
    } = req.body;

    if (role === 'admin' || role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para crear admin' });
    }
    if (role === 'empleado' || role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para crear empleado' });
    }

    // Validación básica
    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await repo.create({
      nombre,
      email,
      telefono,
      password: passwordHash,
      role
    });

    return res.status(201).json({
      ok: true,
      user
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
      const errorEmailDuplicado = EmailDup(error);
    
      if (errorEmailDuplicado) {
        return res.status(400).json(errorEmailDuplicado);
      }
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
}

module.exports = {loginUser, getBoletasByUser, create, me};