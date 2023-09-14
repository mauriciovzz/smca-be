const userAccountsRouter = require('express').Router();
const userAccountscontroller = require('../controllers/user_accounts');

/* Add an user */
userAccountsRouter.post('/', userAccountscontroller.create);

/* Login */
userAccountsRouter.post('/login', userAccountscontroller.login);

module.exports = userAccountsRouter;
