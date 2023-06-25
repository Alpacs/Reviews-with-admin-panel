const db = require('../db')
const { generateID } = require('./func')

class ReviewController {
    
    async add_review (req,res) { // добавить отзыв
        const {id_food_point, id_user, text, score} = req.body;
        let id_city;
        let response = []
        if(id_food_point !== undefined && id_user !== undefined && score !== undefined) {
            try {
                id_city = await db.query(`SELECT id_city FROM food_points WHERE id_food_point=${id_food_point}`)
                id_city = id_city.rows[0].id_city
            } catch (err) {
                console.log(err)
            }
            let id_review;
            try {
                id_review = await generateID('reviews', 'id_review').then(result => {
                    return result
                });
            } catch (err) {
                response.push(err);
            }
            try {
                const newR = await db.query('INSERT INTO reviews (id_review, id_food_point, id_city, id_user, text, score) values($1, $2, $3, $4, $5, $6) RETURNING*', [id_review, id_food_point, id_city, id_user, text, score]);
                let oldValue = await db.query(`SELECT score FROM food_points WHERE id_food_point=${id_food_point}`)
                let newValue = (Number(oldValue.rows[0].score)+Number(score))/2
                console.log(oldValue.rows[0])
                await db.query(`UPDATE food_points SET score=${newValue} WHERE id_food_point=${id_food_point}`)
                response = newR.rows[0];
            }
            catch (err) {
                console.log(err)
                response.push(err);
            }
        } else {
            response = 'Вы ввели не все обязательные параметры.'
        }


        res.json(response)
    }

    async get_review (req, res) { // получить отзывы
        let {id_food_point, id_user, id_city} = req.body
        let response = null;
        let reviews = {
            rows: null
        };
        
        if(id_food_point === 'null' || id_food_point === '' || id_food_point === undefined) {
            id_food_point = null;
        }
        if(id_user === 'null' || id_user === '' || id_user === undefined) {
            id_user = null;
        }
        if(id_city === 'null' || id_city === '' || id_city === undefined) {
            id_city = null;
        }
        try {
            if(id_food_point === null && id_user === null && id_city === null) { // получение по трём параметрам
                reviews = (await db.query(`SELECT * FROM reviews`)).rows
            } else if (id_food_point !== null && id_user === null && id_city === null) { // по столовой
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_food_point=${id_food_point}`)).rows
            } else if (id_food_point !== null && id_user !== null && id_city === null) { // по столовой и пользователю
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_user=${id_user} AND id_food_point=${id_food_point}`)).rows
            } else if (id_food_point !== null && id_user === null && id_city !== null) { // по столовой и городу
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_food_point=${id_food_point} AND id_city=${id_city}`)).rows
            } 
            
            else if (id_food_point === null && id_user !== null && id_city === null) { // по пользователю 
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_user=${id_user}`)).rows
            } else if (id_food_point === null && id_user !== null && id_city !== null) { // по пользователю и городу
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_user=${id_user} AND id_city=${id_city}`)).rows
            }

            else if (id_food_point === null && id_user === null && id_city !== null) { // по городу
                reviews = (await db.query(`SELECT * FROM reviews WHERE id_city=${id_city}`)).rows
            } else {
                reviews.rows = await generateID('reviews', 'id_review').then(result => {
                    return result + 1
                })
            }


            for (let key in reviews) {
                try {
                    reviews[key].name_city = (await db.query(`SELECT name_city FROM cities WHERE id_city=${reviews[key].id_city}`)).rows[0].name_city;
                    reviews[key].name_food_point = (await db.query(`SELECT name_food_point FROM food_points WHERE id_food_point=${reviews[key].id_food_point}`)).rows[0].name_food_point;
                    reviews[key].nickname = (await db.query(`SELECT nickname FROM users WHERE id_user=${reviews[key].id_user}`)).rows[0].nickname;
                    reviews[key].img = (await db.query(`SELECT img FROM food_points WHERE id_food_point=${reviews[key].id_food_point}`)).rows[0].img;
                } catch(err) {
                    console.log(err)
                }
            }
            response = reviews;
        } catch (err) {
            response = err;
            console.log(err)
        }
        for(let i of reviews) {
            i.score = JSON.parse(i.score)
        }
        res.json(response)
    }
    async getNumberReviews(req, res) { // получить количество отзывов

        let {id_food_point, id_user, id_city} = req.body
        let reviews = {
            rows: null
        };
        if(id_food_point === 'null' || id_food_point === '' || id_food_point === undefined) {
            id_food_point = null;
        }
        if(id_user === 'null' || id_user === '' || id_user === undefined) {
            id_user = null;
        }
        if(id_city === 'null' || id_city === '' || id_city === undefined) {
            id_city = null;
        }
        console.log(id_food_point, id_user, id_city)

        if(id_food_point === null && id_user=== null && id_city === null) { // получение по трём параметрам
            reviews = await db.query(`SELECT * FROM reviews`)
        } else if (id_food_point !== null && id_user === null && id_city === null) { // по столовой
            reviews = await db.query(`SELECT * FROM reviews WHERE id_food_point=${id_food_point}`)
        } else if (id_food_point !== null && id_user !== null && id_city === null) { // по столовой и пользователю
            reviews = await db.query(`SELECT * FROM reviews WHERE id_user=${id_user} AND id_food_point=${id_food_point}`)
        } else if (id_food_point !== null && id_user === null && id_city !== null) { // по столовой и городу
            reviews = await db.query(`SELECT * FROM reviews WHERE id_food_point=${id_food_point} AND id_city=${id_city}`)
        } 
        
        else if (id_food_point === null && id_user !== null && id_city === null) { // по пользователю 
            reviews = await db.query(`SELECT * FROM reviews WHERE id_user=${id_user}`)
        } else if (id_food_point === null && id_user !== null && id_city !== null) { // по пользователю и городу
            reviews = await db.query(`SELECT * FROM reviews WHERE id_user=${id_user}`)
        }

        else if (id_food_point === null && id_user === null && id_city !== null) { // по городу
            reviews = await db.query(`SELECT * FROM reviews WHERE id_city=${id_city}`)
        }
        res.json(reviews.rowCount)
    }
    async deleteReview(req, res) {
        const { review_id } = req.body
        let response = null
        if(review_id!==undefined) {
            try {
                const checkReviewExist = await db.query(`SELECT * FROM reviews WHERE id_review=${review_id}`)
                if(checkReviewExist.rows[0]) {
                    await db.query(`DELETE FROM reviews WHERE id_review=${review_id}`);
                    response = 'Отзыв удалён.'
                } else {
                    response = 'Отзыва не существует.'
                }
            } catch (err) {
                response = err;
                console.log(err)
            } 
        } else {
            response = 'Вы ввели не все параметры'
        }
        res.json(response)
    }
    async checkReviewToTwice(req, res) {
        const { id_food_point, id_user } = req.body;

        let response = null;

        try {
            let reviewsToId = await db.query(`SELECT * FROM reviews WHERE id_food_point=${id_food_point} AND id_user=${id_user}`)
            if(reviewsToId.rows[0]) {
                response = {
                    text: 'Вы уже оставляли отзыв к данной точке питания!',
                    confirm: false
                }
            } else {
                response = {
                    confirm: true
                }
            }
        } catch(err) {
            response = err
        }

        res.json(response)
    }
}

module.exports = new ReviewController()