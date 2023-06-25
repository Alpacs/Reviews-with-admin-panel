const db = require('../db')
const { generateID } = require('./func')

class FpController {
    
    async add_food_point (req,res) { // добавить точку питания
        const {name_food_point, type_food_point, id_city, img, score} = req.body;
        
        let response = [];
        let id_fp;
        try {
            id_fp = await generateID('food_points', 'id_food_point').then(result => {
                return result
            });
        } catch (err) {
            response.push(err);
        }
        try {
            const newFP = await db.query('INSERT INTO food_points (id_food_point, name_food_point, type_food_point, id_city, img, score) values($1, $2, $3, $4, $5, $6) RETURNING*', [id_fp, name_food_point, type_food_point, id_city, img, score]);
            response = newFP.rows[0];
        }
        catch (err) {
            response.push(err);
        }
        res.json(response)
    }

    async delete_fp(req, res) {
        let response = null;
        try {
            await db.query('TRUNCATE TABLE food_points CASCADE');
            response = 'Точки питания удалены'
        }
        catch (err) {
            response = err;
        }
        res.json(response)
    }

    async get_fp_to_city (req, res) { // получить food points определенного города
        const {id_city} = req.body
        let fps = null;

        if(id_city!==undefined && id_city!==null && id_city!=='null') {
            try {
                fps = await db.query(`SELECT * FROM food_points WHERE id_city=${id_city}`);
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                fps = await db.query(`SELECT * FROM food_points`);
            } catch (err) {
                console.log(err)
            }
        }
        for(let key in fps.rows) {
            try {
                fps.rows[key].name_city = (await db.query(`SELECT name_city FROM cities WHERE id_city=${fps.rows[key].id_city}`)).rows[0].name_city

            } catch (err) {
                console.log(err)
            }
        }
        res.json(fps.rows)
    }
}

module.exports = new FpController()