const supertest = require('supertest');
const bcrypt = require('bcrypt');
const pool = require('../connections/database');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

// implement validations into the user creation.
// check that the username is long enough
// that the password is strong enough.

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await helper.deleteRows('user_account');
    await helper.deleteRows('user_role');

    const userRole = { roleName: 'admin' };
    await helper.createUserRole(userRole);

    const passwordHash = await bcrypt.hash('sekret', 10);
    const userAccount = {
      firstName: 'FN',
      lastName: 'LN',
      email: 'FNLNQ@gmail.com',
      password: passwordHash,
      roleId: '1',
    };
    await helper.createUserAccount(userAccount);
  });

  test('creation succeeds with a new user', async () => {
    const usersAtStart = await helper.getRows('user_account');

    const newUserAccount = {
      firstName: 'Mauricio',
      lastName: 'Velazquez',
      email: 'mauvelazquez@gmail.com',
      password: '123456789',
      roleId: '1',
    };

    await api
      .post('/api/user_accounts')
      .send(newUserAccount)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.getRows('user_account');
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.email);
    expect(usernames).toContain(newUserAccount.email);
  });

  test('creation fails with proper statuscode and message if email already taken', async () => {
    // const usersAtStart = await helper.usersInDb()

    // const newUser = {
    //   username: 'root',
    //   name: 'Superuser',
    //   password: 'salainen',
    // }

    // const result = await api
    //   .post('/api/users')
    //   .send(newUser)
    //   .expect(400)
    //   .expect('Content-Type', /application\/json/)

    // expect(result.body.error).toContain('expected `username` to be unique')

    // const usersAtEnd = await helper.usersInDb()
    // expect(usersAtEnd).toEqual(usersAtStart)
  });
});

afterAll(async () => {
  await pool.end();
});
