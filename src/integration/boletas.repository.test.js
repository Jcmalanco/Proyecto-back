const { BoletasRepository } = require('../repositories/boletas.repository');
const { pool } = require('../db');

describe('Integracion: BoletasRepository con DB real', () => {
  const repo = new BoletasRepository();
  let boletaId;

  test('Create guarda boleta en DB real', async () => {
    const created = await repo.create({
      cliente_nombre: 'Juan Perez',
      descripcion: 'Telefono Samsung A54',
      categoria: 'Electronica',
      prestamo: 3000,
      plazo_meses: 4
    });

    boletaId = created.id;

    expect(created).toBeTruthy();
    expect(created.cliente_nombre).toBe('Juan Perez');
    expect(created.descripcion).toBe('Telefono Samsung A54');
    expect(created.categoria).toBe('Electronica');
    expect(Number(created.prestamo)).toBeCloseTo(3000);
    expect(created.plazo_meses).toBe(4);
    expect(created.fecha_empeno).toBeTruthy(); // la genera la DB
  });

  afterAll(async () => {
    await pool.query('delete from boletas where id = $1', [boletaId]);
    await pool.end();
  });
});