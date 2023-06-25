const db = require('../db')
const { generateID } = require('./func')

class CityController {
    async add_city (req, res) { // добавить город
        const {name_city, description} = req.body;
        let response = [];
        let id_city;
        try {
            id_city = await generateID('cities', 'id_city').then(result => {
                return result
            });
        } catch (err) {
            response.push(err);
        }
        if(name_city !== '') {
            try {
                const newCity = await db.query('INSERT INTO cities(id_city, name_city, description) VALUES($1, $2, $3) RETURNING *', [id_city, name_city, description]);
                response = newCity.rows[0];
            }
            catch (err) {
                response.push(err);
            }
        } else {
            response = 'Название города не может быть таким коротким.'
        }
        res.json(response)
    }

    async get_cities(req,res) { // получить города
        const cities = await db.query(`SELECT * FROM cities`)
        res.json(cities.rows)
    }
    
}

module.exports = new CityController()