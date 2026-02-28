async function validarBoleta(data) {
  if (!data || Object.keys(data).length === 0) { // Verificar si data tiene contenido
    return { error: 'No se recibió información de la boleta' };
  }

  const { cliente_id, descripcion, categoria, prestamo, plazo_meses } = data;

  if (!cliente_id) { // Verificar que cliente_id esté presente
    return { error: 'ID del cliente es requerido' };
  }

  const clienteIdNum = Number(cliente_id);
  if (!Number.isInteger(clienteIdNum) || clienteIdNum <= 0) {// Verificar que cliente_id sea un número entero positivo
    return { error: 'ID del cliente inválido' };
  }

  if (!descripcion || typeof descripcion !== 'string') {// Verificar que descripción sea una cadena de texto
    return { error: 'Descripción inválida' };
  }

  if (!categoria || typeof categoria !== 'string') {// Verificar que categoría sea una cadena de texto
    return { error: 'Categoría inválida' };
  }

  const prestamoNum = Number(prestamo);
  if (isNaN(prestamoNum) || prestamoNum <= 0) {// Verificar que préstamo sea un número positivo
    return { error: 'Préstamo inválido' };
  }

  const plazoNum = Number(plazo_meses);
  if (!Number.isInteger(plazoNum) || plazoNum <= 0) {// Verificar que plazo_meses sea un número entero positivo
    return { error: 'Plazo inválido' };
  }

  const intereses = {// Intereses por categoría
    electronica: 8,
    joyas: 5,
    herramientas: 10,
    vehiculos: 4,
    ropa: 7,
    general: 6
  };

  const interes = intereses[categoria.toLowerCase()] ?? 6;// Interés por defecto 6% si categoría no coincide

  const totalPrestamo = prestamoNum + (prestamoNum * interes / 100);// Cálculo del total a pagar (préstamo + interés)

  const fechaEmpeno = new Date();// Fecha actual como fecha de empeño
  const fechaVencimiento = new Date(fechaEmpeno);// Fecha de vencimiento calculada sumando los meses del plazo al fecha de empeño
  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoNum);// Ajuste para casos donde el día del mes no existe en el mes de vencimiento

  return {
    data: {
      cliente_id: clienteIdNum,
      descripcion: descripcion.trim(),
      categoria: categoria.toLowerCase(),
      prestamo: prestamoNum,
      interes,
      plazo_meses: plazoNum,
      estado: 'activa',
      fecha_empeno: fechaEmpeno,
      fecha_vencimiento: fechaVencimiento,
      total_prestamo: totalPrestamo,
      total_pagado: 0,
      saldo_pendiente: totalPrestamo
    }
  };
}

async function validarCancelacion(boleta) {
  if (!boleta) {
    return { error: 'Boleta no encontrada' };
  }

  if (boleta.estado === 'cancelada') {
    return { error: 'La boleta ya está cancelada' };
  }

  if (boleta.estado === 'pagada') {
    return { error: 'No se puede cancelar una boleta que ya fue pagada' };
  }

  return { success: true };
}

module.exports = { validarBoleta, validarCancelacion };