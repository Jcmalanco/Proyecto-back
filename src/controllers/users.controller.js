const bcrypt = require('bcryptjs');
const { sign } = require('../middlewares/auth');
const { validarUsuario } = require('../domain/users.rules');
const { UsersRepository } = require('../repositories/users.repository');

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

// Crear usuario
async function create(req, res) {
  const { nombre, email, password, telefono, role } = req.body;

  // Validar usuario
  const validation = validarUsuario({ nombre, email, password, telefono, role });
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const { data } = validation;

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await repo.create({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password: passwordHash,
    role: data.role
  });

  return res.status(201).json({
    ok: true,
    user
  });
}

module.exports = {loginUser, create};