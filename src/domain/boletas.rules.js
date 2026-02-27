function validarBoleta(data) {
  const {
    cliente_id,
    descripcion,
    categoria,
    prestamo,
    plazo_meses
  } = data;

  // Validar cliente_id como número (int8 en BD)
  if (!cliente_id) {
    return { error: { error: 'ID del cliente es requerido' } };
  }
  
  const clienteIdNum = Number(cliente_id);
  if (isNaN(clienteIdNum) || clienteIdNum <= 0) {
    return { error: { error: 'ID del cliente debe ser un número válido' } };
  }

  // Validar descripción
  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    return { error: { error: 'Descripción inválida' } };
  }

  // Validar categoría
  if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
    return { error: { error: 'Categoría inválida' } };
  }

  // Validar préstamo (convertir a número)
  const prestamoNum = Number(prestamo);
  if (isNaN(prestamoNum) || prestamoNum <= 0) {
    return { error: { error: 'Préstamo debe ser un número válido mayor a 0' } };
  }

  // Validar plazo_meses (convertir a número entero)
  const plazoNum = Number(plazo_meses);
  if (isNaN(plazoNum) || !Number.isInteger(plazoNum) || plazoNum <= 0) {
    return { error: { error: 'Plazo en meses debe ser un número entero válido mayor a 0' } };
  }

  // Definir interés según categoría (debe coincidir con el repositorio)
  const interesesPorCategoria = {
    'electronica': 8,
    'joyas': 5,
    'herramientas': 10,
    'vehiculos': 4,
    'ropa': 7,
    'general': 6
  };

  const interes = interesesPorCategoria[categoria.toLowerCase()] || 6;
  
  // Calcular total préstamo con interés
  const totalPrestamo = prestamoNum + (prestamoNum * interes / 100);
  
  // Calcular fecha de vencimiento
  const fechaEmpeno = new Date();
  const fechaVencimiento = new Date(fechaEmpeno);
  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoNum);

  return {
    data: {
      cliente_id: clienteIdNum,
      descripcion: descripcion.trim(),
      categoria: categoria.trim().toLowerCase(),
      prestamo: prestamoNum,
      interes,                    // Agregado
      plazo_meses: plazoNum,
      fecha_empeno: fechaEmpeno.toISOString().split('T')[0], // Solo YYYY-MM-DD
      fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0], // Solo YYYY-MM-DD
      estado: 'activa',
      total_pagado: 0,
      total_prestamo: totalPrestamo,  // Agregado
      saldo_pendiente: totalPrestamo   // Agregado
    }
  };
}

module.exports = { validarBoleta };