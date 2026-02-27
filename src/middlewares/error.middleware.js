function errorHandler(err, req, res, next) {
  console.log('Error detectado:', err.message);

  return res.status(500).json({error: 'Error Interno del Servidor'})
}
function EmailDup(error) {
  // Verificar si es error de email duplicado (código 23505 de PostgreSQL)
  if (error.constraint === 'clientes_email_key' || 
     error.message?.includes('clientes_email_key')) {
    return {
      error: 'El email ya está registrado en el sistema',
    };
  }
  
  // Si no es el error específico, retornar null
  return null;
}

module.exports = { errorHandler, EmailDup }