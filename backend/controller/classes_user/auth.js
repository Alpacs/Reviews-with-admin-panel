const { response } = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db')
const admin_commands = require('../admin_commands.js')

class AuthService {
    #signature = 'agjl2k_g_jdddsgvo33gggg';
    #expiration = '12h' 
    async generateToken(user) {
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            create_time: new Date(),
        };
        return jwt.sign({ data }, this.#signature, { expiresIn: this.#expiration });
    }
    async confirmation_token(token) {
        let token_confirm = {
            token: token,
            auth_data: {
                id: null,
            },
            admin_commands: ''
        }
        // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJuYW1lIjoiTmVBZG1pbjIiLCJlbWFpbCI6ImRtaXRyeUBtYWlsLnJ1IiwiY3JlYXRlX3RpbWUiOiIyMDIzLTA1LTA4VDEwOjI4OjI1LjI5OFoifSwiaWF0IjoxNjgzNTQxNzA1LCJleHAiOjE2ODM1ODQ5MDV9.AiMYbDQvqB9Y8zIj8sXUafGNzHRwX30FblIt6E6lAcM"
        try {
            let decoded = jwt.verify(token, this.#signature)
            token_confirm.auth_data = decoded.data;
            try {
                token_confirm.admin = (await db.query(`SELECT admin FROM users WHERE id_user=${token_confirm.auth_data.id}`)).rows[0].admin
                if(token_confirm.admin) {
                    token_confirm.admin_commands = admin_commands
                }
            } catch(err) {
                console.log(err)
            }
        } catch (err) {
            token_confirm = err
        }
        return token_confirm
    }   
} 
 
module.exports = new AuthService(); 