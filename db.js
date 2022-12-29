const mysql = require('mysql2');
const dotenv = require('dotenv')


dotenv.config({ path: __dirname + '/.env' });
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'website'
});




db.connect(function(err){
    if (err) throw err;
    console.log('Connected!');
});

module.exports = db;