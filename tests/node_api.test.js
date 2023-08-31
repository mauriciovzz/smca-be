const supertest = require('supertest');
const pool = require('../connections/database');
const app = require('../app');
const nodesController = require('../controllers/nodes');

const api = supertest(app);

const initialNodes = [
  {
    nodeType: 'INDOOR',
  },
  {
    nodeType: 'OUTDOOR',
  },
];

beforeEach(async () => {
  await nodesController.deleteAll();
  await nodesController.create(initialNodes[0]);
  await nodesController.create(initialNodes[1]);
});

test('nodes are returned as json', async () => {
  await api
    .get('/api/nodes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/nodes');
  expect(response.body).toHaveLength(initialNodes.length);
});

test('a specific node is within the returned nodes', async () => {
  const response = await api.get('/api/nodes');

  const contents = response.body.map((r) => r.node_type);
  expect(contents).toContain('INDOOR');
});

afterAll(async () => {
  await pool.end();
});
