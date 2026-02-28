const bcrypt = require('bcryptjs');
const { sign } = require('../middlewares/auth');
const { UsersRepository } = require('../repositories/users.repository');
const { validarUsuario } = require('../domain/users.rules');
const { EmailDup } = require('../middlewares/error.middleware');

const repo = new UsersRepository();

const loginUser = async (req, res) => { // Log in
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password requeridos' });
  }

  const user = await repo.findByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = sign({ id: user.id, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      role: user.role
    }
  });
};


const me = async (req, res) => { // Info del usuario autenticado (sin password)
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
};


const create = async (req, res) => { // Crear usuario
  const validation = validarUsuario(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  // Solo admin puede crear admin o empleado
  if (['admin', 'empleado'].includes(validation.data.role) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try { // Hash de la contraseña antes de guardar
    const passwordHash = await bcrypt.hash(validation.data.password, 10);

    const user = await repo.create({...validation.data, password: passwordHash});

    res.status(201).json({ ok: true, user });

  } catch (error) {
    const emailDup = EmailDup(error); // Verificar si el error es por email duplicado
    if (emailDup) return res.status(400).json(emailDup);

    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

module.exports = {loginUser, me, create};