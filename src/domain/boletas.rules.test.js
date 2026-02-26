const { validarBoleta } = require('../domain/boletas.rules');

describe('validarBoleta', () => {

  test('debe validar una boleta correcta', () => {
    const data = {
      cliente_id: 1,
      descripcion: 'Anillo de oro 14k',
      categoria: 'Joyeria',
      prestamo: 500,
      interes: 0.1,
      plazo_dias: 180,
      fecha_empeno: '2024-01-10'
    };

    const result = validarBoleta(data);

    expect(result.error).toBeUndefined();
    expect(result.data.cliente_id).toBe(1);
    expect(result.data.estado).toBe('activa');
    expect(result.data.total_pagado).toBe(0);
  });

  test('falla si falta cliente_id', () => {
    const data = {
      descripcion: 'Anillo de oro',
      categoria: 'Joyeria',
      prestamo: 500,
      interes: 0.1,
      plazo_dias: 180,
      fecha_empeno: '2024-01-10'
    };

    const result = validarBoleta(data);

    expect(result.error).toBeDefined();
  });

  test('falla si el prestamo es inválido', () => {
    const data = {
      cliente_id: 1,
      descripcion: 'Anillo de oro',
      categoria: 'Joyeria',
      prestamo: -100,
      interes: 0.1,
      plazo_dias: 180,
      fecha_empeno: '2024-01-10'
    };

    const result = validarBoleta(data);

    expect(result.error).toBeDefined();
  });

  test('falla si el interes es inválido', () => {
    const data = {
      cliente_id: 1,
      descripcion: 'Anillo de oro',
      categoria: 'Joyeria',
      prestamo: 500,
      interes: 0,
      plazo_dias: 180,
      fecha_empeno: '2024-01-10'
    };

    const result = validarBoleta(data);

    expect(result.error).toBeDefined();
  });

  test('falla si la fecha de empeño es inválida', () => {
    const data = {
      cliente_id: 1,
      descripcion: 'Anillo de oro',
      categoria: 'Joyeria',
      prestamo: 500,
      interes: 0.1,
      plazo_dias: 180,
      fecha_empeno: 'fecha-falsa'
    };

    const result = validarBoleta(data);

    expect(result.error).toBeDefined();
  });

});