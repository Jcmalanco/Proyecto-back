const { stripe } = require('../middlewares/stripe.middleware');
const { crearPaymentIntent, registrarPagoStripe, validarDatosPago } = require('../domain/pagos.rules');

// Crear PaymentIntent (lo llama el frontend para iniciar el pago)
const crear = async (req, res) => {
  try {
    validarDatosPago(req.body); // Validar datos antes de intentar crear el PaymentIntent
    const clientSecret = await crearPaymentIntent(req.body);
    res.json({ clientSecret });
  } catch (error) {
    console.error('Error creando payment intent:', error);
    res.status(400).json({ error: error.message });
  }
};

// Verificar pago (lo llama el frontend después de la redirección de Stripe)
const verificar = async (req, res) => {
  try {
    const { payment_intent, boleta_id } = req.body;
    
    if (!payment_intent) {
      return res.status(400).json({ error: 'payment_intent es requerido' });
    }

    // Recuperar el PaymentIntent de Stripe
    const intent = await stripe.paymentIntents.retrieve(payment_intent);
    
    // Verificar que el pago fue exitoso
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'El pago no fue exitoso', 
        estado: intent.status 
      });
    }
    
    // Verificar que corresponde a la boleta
    if (parseInt(intent.metadata.boleta_id) !== parseInt(boleta_id)) {
      return res.status(400).json({ error: 'El pago no corresponde a esta boleta' });
    }

    // Registrar el pago y actualizar boleta
    const resultado = await registrarPagoStripe(intent);
    
    res.json(resultado);
    
  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crear, verificar };