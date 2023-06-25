const Router = require('express')
const { json } = require('express/lib/response')
const AdminRouter = new Router()

const adminController = require('../controller/admin.controller')

AdminRouter.get('/drop_table', adminController.drop_table); // отчистить таблицу

module.exports = AdminRouter