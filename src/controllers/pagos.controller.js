const { stripe } = require('../middlewares/stripe.middleware');
const { crearPaymentIntent, registrarPagoStripe, validarDatosPago } = require('../domain/pagos.rules');

// Crear PaymentIntent
const crear = async (req, res) => {
  try {

    validarDatosPago(req.body);

    const clientSecret = await crearPaymentIntent(req.body);

    return res.json({
      ok: true,
      clientSecret
    });

  } catch (error) {

    console.error('Error creando payment intent:', error);

    return res.status(400).json({
      ok: false,
      error: error.message
    });

  }
};

// Verificar pago
const verificar = async (req, res) => {
  try {

    const { payment_intent, boleta_id } = req.body;

    if (!payment_intent) {
      return res.status(400).json({
        ok: false,
        error: 'payment_intent es requerido'
      });
    }

    const intent = await stripe.paymentIntents.retrieve(payment_intent);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({
        ok: false,
        error: 'El pago no fue exitoso',
        estado: intent.status
      });
    }

    // tomar boleta_id del body o del metadata
    const boletaIdFinal =
      boleta_id || intent.metadata.boleta_id;

    if (!boletaIdFinal) {
      return res.status(400).json({
        ok: false,
        error: 'boleta_id no encontrado'
      });
    }

    if (parseInt(intent.metadata.boleta_id) !== parseInt(boletaIdFinal)) {
      return res.status(400).json({
        ok: false,
        error: 'El pago no corresponde a esta boleta'
      });
    }

    const resultado = await registrarPagoStripe(intent);

    return res.json({
      ok: true,
      resultado
    });

  } catch (error) {

    console.error('Error verificando pago:', error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }
};

module.exports = { crear, verificar };