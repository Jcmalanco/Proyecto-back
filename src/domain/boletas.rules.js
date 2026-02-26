// Validación para crear boleta
function validarBoleta(data) {
  const {
    nombre_cliente,
    descripcion,
    categoria,
    prestamo,
    plazo_meses
  } = data;

  if (!nombre_cliente || typeof nombre_cliente !== 'string') {
    return { error: { error: 'Nombre del cliente inválido' } };
  }

  if (!descripcion || typeof descripcion !== 'string') {
    return { error: { error: 'Descripción inválida' } };
  }

  if (!categoria || typeof categoria !== 'string') {
    return { error: { error: 'Categoría inválida' } };
  }

  if (!Number.isFinite(prestamo) || prestamo <= 0) {
    return { error: { error: 'Préstamo inválido' } };
  }

  if (!Number.isInteger(plazo_meses) || plazo_meses <= 0) {
    return { error: { error: 'Plazo en meses inválido' } };
  }


  return {
    data: {
      nombre_cliente,
      descripcion,
      categoria,
      prestamo,
      plazo_meses,
      fecha_empeno: new Date().toISOString(),
      estado: 'activa',
      total_pagado: 0
    }
  };
}

module.exports = {validarBoleta};