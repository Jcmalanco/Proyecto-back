const { router: boletasRouter } = require('./src/routes/boletas.routes');
const { router: webhooksRouter } = require('./src/routes/webhooks.routes');
const { router: pagosRouter } = require('./src/routes/pagos.routes');
const { router: usersRouter } = require('./src/routes/users.routes');
const { errorHandler } = require('./src/middlewares/error.middleware');
const { authMiddleware } = require('./src/middlewares/auth');
const rateLimit = require('express-rate-limit');
const { pool } = require('./src/db');
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

const allowed = [ //origines permitidos
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dfs-front.vercel.app'
];

const limiter = rateLimit({//limita a 100 solicitudes por IP cada 15 minutos
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.'
});

app.use(limiter); //aplica el limitador a todas las rutas

app.use(cors({ //configura CORS para permitir solo los orígenes especificados
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS bloqueado: ' + origin));
  }
}));

app.use(express.json()); //para parsear JSON en el body de las solicitudes

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API OK');
});

app.use('/boletas', boletasRouter);
app.use('/users', usersRouter);
app.use('/pagos', pagosRouter);
app.use('/webhooks', webhooksRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/privado', authMiddleware, (req, res) => {
  return res.json({
    ok: true,
    user: req.user
  });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('select 1');
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
});

app.get('/health/db', async (req, res) => {
  try {
    const r = await pool.query('select 1 as ok');
    return res.json({ ok: true, db: r.rows[0].ok });
  } catch (err) {
    console.log('DB Error', err.message);
    return res.status(500).json({ ok: false, error: 'DB no disponible' });
  }
});
app.use(errorHandler);
