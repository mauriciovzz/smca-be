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

afterAll(async () => {
  await pool.end();
});
