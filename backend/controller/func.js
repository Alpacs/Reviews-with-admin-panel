const db = require('../db')

async function generateID(name_tables, name_column) {
    let id = null;
    try {
        id = await db.query(`select ${name_column} from ${name_tables} where ${name_column} = (select MAX(${name_column}) from ${name_tables})`);
        if (id.rowCount === 0) {
            id = 0;
        } 
        else {
            id = id.rows[0];
            id = Number(id[`${name_column}`]) + 1;
        }
    } catch (err) {
        console.log(err)
    }
    
    return id;
}

module.exports = { generateID }