const Router = require('express')
const { json } = require('express/lib/response')
const userController = require('../controller/user.controller')
const UserRouter = new Router()

UserRouter.post('/registration', userController.add_user);
UserRouter.post('/auth', userController.login);
UserRouter.get('/get_users', userController.getUsers);
UserRouter.post('/get_user', userController.getUser);
UserRouter.post('/confirmToken', userController.takeToken);
UserRouter.post('/deleteToken', userController.deleteToken);
UserRouter.post('/QX4ZLoai40NN3f4UNuk1', userController.add_user_admin)

module.exports = UserRouter