const { validarUsuario } = require('../domain/users.rules');

describe('validarUsuario', () => {

  test('debe validar un usuario correcto', () => {
    const data = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      telefono: '5512345678',
      password: '123456',
      role: 'admin'
    };

    const result = validarUsuario(data);

    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(data);
  });

  test('falla si falta el nombre', () => {
    const data = {
      email: 'juan@test.com',
      telefono: '5512345678',
      password: '123456',
      role: 'admin'
    };

    const result = validarUsuario(data);

    expect(result.error).toBeDefined();
  });

  test('falla si el password es muy corto', () => {
    const data = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      telefono: '5512345678',
      password: '123',
      role: 'admin'
    };

    const result = validarUsuario(data);

    expect(result.error).toBeDefined();
  });

  test('falla si el rol no es válido', () => {
    const data = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      telefono: '5512345678',
      password: '123456',
      role: 'cliente'
    };

    const result = validarUsuario(data);

    expect(result.error).toBeDefined();
  });

  test('falla si falta el teléfono', () => {
    const data = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: '123456',
      role: 'empleado'
    };

    const result = validarUsuario(data);

    expect(result.error).toBeDefined();
  });

});