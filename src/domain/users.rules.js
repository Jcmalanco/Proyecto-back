function validarUsuario(data) {
  
  if (!data || Object.keys(data).length === 0) {// Verificar si data tiene contenido
    return { error: 'No se recibió información del usuario' };
  }

  const { nombre, email, telefono, password, role } = data;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { error: 'Nombre inválido' };
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return { error: 'Email inválido' };
  }

  if (!telefono || typeof telefono !== 'string' || telefono.trim() === '') {
    return { error: 'Teléfono inválido' };
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return { error: 'Password inválido (mínimo 6 caracteres)' };
  }

  if (!['admin', 'empleado', 'cliente'].includes(role)) {
    return { error: 'Rol inválido' };
  }

  return {
    data: {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      password,
      role
    }
  };
}

module.exports = { validarUsuario };