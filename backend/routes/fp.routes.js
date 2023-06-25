const Router = require('express')
const { json } = require('express/lib/response')
const FpRouter = new Router()
const fpController = require('../controller/fp.controller')

FpRouter.post('/add_food_point', fpController.add_food_point) // добавить точку питания
FpRouter.get('/delete_fps', fpController.delete_fp) // удалить все точки питания
FpRouter.post('/get_fp_to_city', fpController.get_fp_to_city) // получить точки питания по городам

module.exports = FpRouter