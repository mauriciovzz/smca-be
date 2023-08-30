const supertest = require('supertest');
const pool = require('../connections/database');
const app = require('../app');

const api = supertest(app);

test('nodes are returned as json', async () => {
  await api
    .get('/api/nodes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two nodes', async () => {
  const response = await api.get('/api/nodes');

  expect(response.body).toHaveLength(2);
});

test('the first node is INDOOR', async () => {
  const response = await api.get('/api/nodes');

  expect(response.body[0].node_type).toBe('INDOOR');
});

afterAll(async () => {
  await pool.end();
});
