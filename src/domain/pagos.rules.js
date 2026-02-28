const { stripe } = require('../middlewares/stripe.middleware');
const { PagosRepository } = require('../repositories/pagos.repository');
const { BoletasRepository } = require('../repositories/boletas.repository');

// Instancias
const boletasRepo = new BoletasRepository();
const pagosRepo = new PagosRepository();

// ✅ NUEVA FUNCIÓN: Validar que los datos sean válidos
function validarDatosPago(data) {
  // Verificar que data existe
  if (!data) {
    throw new Error('No se recibieron datos de pago');
  }

  // Verificar que boleta_id sea válido
  if (data.boleta_id === undefined || data.boleta_id === null) {
    throw new Error('boleta_id es requerido');
  }

  // Verificar que monto sea válido
  if (data.monto === undefined || data.monto === null) {
    throw new Error('monto es requerido');
  }

  const boletaIdNum = Number(data.boleta_id);
  if (isNaN(boletaIdNum) || boletaIdNum <= 0) {
    throw new Error('boleta_id debe ser un número válido');
  }

  const montoNum = Number(data.monto);
  if (isNaN(montoNum) || montoNum <= 0) {
    throw new Error('monto debe ser un número válido mayor a 0');
  }

  return {
    boleta_id: boletaIdNum,
    monto: montoNum
  };
}

async function crearPaymentIntent(data) {
  try {
    // ✅ VALIDAR DATOS PRIMERO
    const { boleta_id, monto } = validarDatosPago(data);

    // Validar que la boleta existe
    const boleta = await boletasRepo.getById(boleta_id);
    if (!boleta) {
      throw new Error('Boleta no encontrada');
    }
    
    // Validar saldo suficiente
    if (monto > parseFloat(boleta.saldo_pendiente)) {
      throw new Error(`El monto a pagar ($${monto}) excede el saldo pendiente ($${boleta.saldo_pendiente})`);
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(monto * 100),
      currency: 'mxn',
      metadata: { 
        boleta_id: boleta_id.toString()
      }
    });

    return intent.client_secret;

  } catch (error) {
    // ✅ RELANZAR EL ERROR PARA QUE EL CONTROLLER LO MANEJE
    throw error;
  }
}

async function registrarPagoStripe(intent) {
  // Verificar que el pago fue exitoso
  if (intent.status !== 'succeeded') {
    throw new Error('El pago no fue exitoso');
  }

  const boleta_id = parseInt(intent.metadata.boleta_id);
  const monto = intent.amount / 100;

  // 1. Obtener siguiente número de pago
  const numero_pago = await pagosRepo.getNextNumeroPago(boleta_id);

  // 2. Registrar el pago
  await pagosRepo.createPago({
    boleta_id,
    numero_pago,
    monto,
    metodo_pago: 'stripe'
  });

  // 3. Actualizar la boleta
  const boletaActualizada = await boletasRepo.updatePago(boleta_id, monto);

  return {
    success: true,
    message: 'Pago registrado exitosamente',
    data: {
      boleta_id,
      numero_pago,
      monto,
      nuevo_saldo: boletaActualizada.saldo_pendiente,
      nuevo_estado: boletaActualizada.estado
    }
  };
}

module.exports = { crearPaymentIntent, registrarPagoStripe, validarDatosPago };