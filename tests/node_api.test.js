const supertest = require('supertest');
const pool = require('../connections/database');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await helper.deleteRows('node');

  for (let node of helper.initialNodes) {
    await helper.createNode(node);
  }
});

test('nodes are returned as json', async () => {
  await api
    .get('/api/nodes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all nodes are returned', async () => {
  const response = await api.get('/api/nodes');
  expect(response.body).toHaveLength(helper.initialNodes.length);
});

test('a specific node is within the returned nodes', async () => {
  const response = await api.get('/api/nodes');

  expect(response.body).toContainEqual({ node_id: 2, node_type: 'OUTDOOR' });
});

test('a valid node can be added', async () => {
  const newNode = {
    nodeType: 'INDOOR',
  };

  await api
    .post('/api/nodes')
    .send(newNode)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.getRows('node');

  expect(notesAtEnd).toHaveLength(helper.initialNodes.length + 1);
  expect(notesAtEnd).toContainEqual({ node_id: 2, node_type: 'INDOOR' });
});

test('node without type is not added', async () => {
  const newNode = {
  };

  await api
    .post('/api/nodes')
    .send(newNode)
    .expect(400);

  const notesAtEnd = await helper.getRows('node');

  expect(notesAtEnd).toHaveLength(helper.initialNodes.length);
});

afterAll(async () => {
  await pool.end();
});
