admin_commands = {
    users: {
        registration_admin: {
            req: 'http://localhost:8080/UR/QX4ZLoai40NN3f4UNuk1',
            method: 'POST',
            required_parameters: ['nickname', 'regPass', 'regPassConfirm', 'regLogin'],
            param: {},
            description: 'Регистрация нового пользователя. По умолчанию всегда админ.'
        },
        registration: {
            req: 'http://localhost:8080/UR/registration',
            method: 'POST',
            required_parameters: ['nickname', 'regPass', 'regPassConfirm', 'regLogin'],
            param: {},
            description: 'Регистрация нового пользователя. По умолчанию всегда не админ.'
        },
        auth: {
            req: 'http://localhost:8080/UR/auth',
            method: 'POST',
            required_parameters: ['email', 'password'],
            param: {},
            description: 'Авторизация пользователя.'
        },
        getUser: {
            req: 'http://localhost:8080/UR/get_user',
            method: 'POST',
            required_parameters: ['id_user'],
            param: {},
            description: 'Получить данные о пользователе по id.'
        },
        getUsers: {
            req: 'http://localhost:8080/UR/get_users',
            method: 'GET',
            description: 'Получить всех пользователей.',
            param: {},
        },
        confirmToken: {
            req: 'http://localhost:8080/UR/confirmToken',
            method: 'POST',
            required_parameters: ['token'],
            param: {},
            description: 'Подтвердить токен.'
        },
        deleteToken: {
            req: 'http://localhost:8080/UR/deleteToken',
            method: 'POST',
            required_parameters: ['token'],
            param: {},
            description: 'Удалить токен.'
        }

    },
    cities: {
        addCity: {
            req: 'http://localhost:8080/CR/add_city',
            method: 'POST',
            required_parameters: ['name_city', 'description'],
            param: {},
            description: 'Добавить новый город.'
        },
        getCities: {
            req: 'http://localhost:8080/CR/get_cities',
            method: 'GET',
            param: {},
            description: 'Получить все города.'
        }
    },
    food_points: {
        addFoodPoint: {
            req: 'http://localhost:8080/FR/add_food_point',
            method: 'POST',
            required_parameters: ['name_food_point', 'type_food_point', 'id_city', 'img', 'score'],
            param: {},
            description: 'Добавить новую точку питания.'
        },
        getFpToCity: {
            req: 'http://localhost:8080/FR/get_fp_to_city',
            method: 'POST',
            required_parameters: ['id_city'],
            param: {},
            description: 'Если передать null в id_city, то вернёт все точки питания.'
        },
        deleteFPS: {
            req: 'http://localhost:8080/FR/delete_fps',
            method: 'GET',
            required_parameters: [],
            param: {},
            description: 'Удалить все точки питания.'
        }
    },
    reviews: {
        addReview: {
            req: 'http://localhost:8080/RR/add_review',
            method: 'POST',
            required_parameters: ['id_food_point', 'id_user', 'text', 'score'],
            param: {},
            description: 'Добавить новый отзыв.'
        },
        getReview: {
            req: 'http://localhost:8080/RR/get_review',
            method: 'POST',
            required_parameters: ['id_food_point', 'id_user', 'id_city'],
            param: {},
            description: 'В зависимости от заданного количества параметров, вернёт отзывы - это фильтр. По точкам питания, по городам, по пользователям и различные вариации. Если все параметры равны null, то вернёт все отзывы.'
        },
        getNumberReviews: {
            req: 'http://localhost:8080/RR/get_number_reviews',
            method: 'POST',
            required_parameters: ['id_food_point', 'id_user', 'id_city'],
            param: {},
            description: 'Похоже на обычное getReview, но возвращает количество отзывов, а не сами отзывы.'
        },
        deleteReview: {
            req: 'http://localhost:8080/RR/deleteReview',
            method: 'POST',
            required_parameters: ['review_id'],
            param: {},
            description: 'Удалить отзыв по id.'
        },
        checkReview: {
            req: 'http://localhost:8080/RR/checkReview',
            method: 'POST',
            required_parameters: ['id_food_point', 'id_user'],
            param: {},
            description: 'Проверить отзыв от пользователя на наличие уже отзыва к этой точке питания.'
        }

    }
}

module.exports = admin_commands