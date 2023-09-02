const userRolesRouter = require('express').Router();
const userRolescontroller = require('../controllers/user_roles');

/* Add an user */
userRolesRouter.post('/', userRolescontroller.create);

module.exports = userRolesRouter;
