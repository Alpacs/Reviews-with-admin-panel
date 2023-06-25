const { response } = require('express');
const db = require('../db')
const func = require('./func')
const admin_commands = require('./admin_commands.js')

const auth = require('./classes_user/auth')

class UserController {

    async add_user (req,res) { 
        const { nickname, regPass, regPassConfirm, regLogin } = req.body
        let id_user = null, response = [];

        try {
            id_user = await func.generateID('users', 'id_user').then(result => {
                return result;
            });
        } catch (err) {
            console.log(err)
        };
        
        try {
            if (regPass === regPassConfirm) {
                let confirm_email = await db.query(`SELECT id_user FROM users WHERE email='${regLogin}'`);
                if(confirm_email.rowCount >= 1) {
                    response = "Пользователь с таким логином уже существует."
                } else {
                    await db.query(`INSERT INTO users (id_user, nickname, password, email, admin) values($1, $2, $3, $4, $5) RETURNING*`, [id_user, nickname, regPass, regLogin, false]);
                    // подтверждение email
                    // try {

                    // } catch (err) {

                    // }
                    response = "Успешная регистрация!";
                }
            } else {
                response.push("Пароли не совпадают!")
            }
        } catch (err) {
            response.push(err);
        };
        res.json(response);
    }

    async add_user_admin (req,res) { 
        const { nickname, regPass, regPassConfirm, regLogin } = req.body
        let id_user = null, response = [];

        try {
            id_user = await func.generateID('users', 'id_user').then(result => {
                return result;
            });
        } catch (err) {
            console.log(err)
        };
        
        try {
            if (regPass === regPassConfirm) {
                let confirm_email = await db.query(`SELECT id_user FROM users WHERE email='${regLogin}'`);
                if(confirm_email.rowCount >= 1) {
                    response = "Пользователь с таким логином уже существует."
                } else {
                    await db.query('INSERT INTO users (id_user, nickname, password, email, admin) values($1, $2, $3, $4, $5) RETURNING*', [id_user, nickname, regPass, regLogin, true]);
                    // подтверждение email
                    // try {

                    // } catch (err) {

                    // }
                    response = "Успешная регистрация!";
                }
            } else {
                response.push("Пароли не совпадают!")
            }
        } catch (err) {
            response.push(err);
        };
        res.json(response);
    }

    async login (req, res) {
        
        const { email, password } = req.body;
        
        let response = {
                text: null,
                token: null
            },
            user = {
                id: null,
                name: null,
                email: null

            },
            pass_confirm = null, 
            adminUserConfirm = null,    
            authID = null,
            id_token = null
        try {
            authID = await db.query(`SELECT id_user FROM users WHERE email='${email}'`);
            if (authID.rowCount === 0) {
                response.text = 'Неправильный Email'
            } else {
                authID = authID.rows[0].id_user;
            }
            try {
                user.id = authID;
                let name = await db.query(`SELECT nickname FROM users WHERE id_user=${user.id}`);
                
                user.name = name.rows[0].nickname
                user.email = email;
    
                pass_confirm = await db.query(`SELECT password FROM users WHERE id_user=${user.id}`);
                
                adminUserConfirm = await db.query(`SELECT admin FROM users WHERE id_user=${user.id}`);
                pass_confirm = pass_confirm.rows[0].password;
                
                if(password === pass_confirm) {
                    response.token = await auth.generateToken(user).then(result => {
                        return result
                    });
                    response.name = user.name;
                    response.text = 'Авторизация успешна';
                    response.id = user.id
                    if(adminUserConfirm.rows[0].admin) {
                        response.admin_commands = admin_commands
                        response.admin = true
                    } else {
                        response.admin = false
                    }
                    try{
                        try {
                            id_token = await func.generateID('tokens', 'id_token').then(result => {
                                return result;
                            });
                        } catch (err) {
                            console.log(err)
                        };
                        await db.query('INSERT INTO tokens (id_token, id_user, token) values($1, $2, $3) RETURNING*', [id_token, user.id, response.token]);
                    } catch(err) {
                        console.log(err)
                    }
                } else {
                    response.text = 'Неверный пароль!';
                }
            } catch (err) {
                response.text = err;
                if (authID.rowCount === 0) {
                    response.text = 'Неправильный Email'
                }
            }
        } catch (err) {
            response.text = err;
        }
        res.json(response)
    }

    async getUsers(req, res) {
        const users = await db.query('SELECT * FROM users');
        res.json(users.rows);
    }
    async getUser(req, res) {
        const { id_user } = req.body;
        let response = ''
        try {
            if(id_user !== undefined) {
                console.log(id_user)
                const user = await db.query(`SELECT nickname FROM users WHERE id_user=${id_user}`);
                
            
                if(user.rows[0] === undefined) {
                    response = 'Нет пользователя с таким id'
                } else {
                    response = user.rows[0]
                }
            } else {
                response = 'Вы не заполнили поле для поиска пользователя.'
            }
        } catch (err) {
            response = err
        }
        res.json(response)
    }
    async takeToken(req, res) {
        const { token } = req.body;
        const messageToken = await auth.confirmation_token(token).then(result => {
            return result
        });
        res.json(messageToken)
    }
    async deleteToken(req, res) {
        const { token } = req.body;
        let response = '';
        
        try {
            const checkTokenExist = await db.query(`SELECT * FROM tokens WHERE token='${token}'`)
            console.log(checkTokenExist.rows)
            if(checkTokenExist.rows[0]) {
                await db.query(`DELETE FROM tokens WHERE token='${token}'`)
                response = 'Токен удалён.'
            } else {
                response = 'Токен не обнаружен в базе данных.'
            }
        } catch (err) {
            response = err;
        }
        res.json(response)
    }
}

module.exports = new UserController()