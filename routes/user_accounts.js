const userAccountsRouter = require('express').Router();
const userAccountscontroller = require('../controllers/user_accounts');

/* Add an user */
userAccountsRouter.post('/', userAccountscontroller.create);

module.exports = userAccountsRouter;
