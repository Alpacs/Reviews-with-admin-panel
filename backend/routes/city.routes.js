const Router = require('express')
const { json } = require('express/lib/response')
const CityRouter = new Router()
const cityController = require('../controller/city.controller')


CityRouter.post('/add_city', cityController.add_city) // добавить город
CityRouter.get('/get_cities', cityController.get_cities) // получить города


module.exports = CityRouter