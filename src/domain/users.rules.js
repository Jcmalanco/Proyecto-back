// Validación para crear usuario
function validarUsuario(data) {
  const { nombre, email, telefono, password, role } = data;


  if (!nombre || typeof nombre !== 'string') {
    return { error: { error: 'Nombre inválido' } };
  }

  if (!email || typeof email !== 'string') {
    return { error: { error: 'Email inválido' } };
  }
  
  if (!telefono || typeof telefono !== 'string') {
    return { error: { error: 'Teléfono inválido' } };
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return { error: { error: 'Password inválido (mínimo 6 caracteres)' } };
  }

  if (!role || !['admin', 'empleado', 'cliente'].includes(role)) {
    return { error: { error: 'Rol inválido' } };
  }

  return {
    data: {
      nombre,
      email,
      telefono,
      password,
      role
    }
  };
}

module.exports = {validarUsuario};