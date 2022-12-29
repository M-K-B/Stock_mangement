const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon'

const db = require('../db')


const salt = bcrypt.genSalt(saltRounds)

/**
 * Checks user credentials.
 * @param {string} username
 * @param {string} password
 * @returns {string} the username for the valid account
 */
async function login(data) {
	console.log(data)
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${data.username}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${data.username}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${data.username}";`
	records = await db.query(sql)
	const valid = await bcrypt.compare(data.password, records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${data.username}"`)
	return data.username
}


/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} Sum of x and y
 */

async function register(data) {
	const password = await bcrypt.hash(data.password, salt)
	const sql = `INSERT INTO accounts(user, pass) VALUES("${data.username}", "${password}")`
	console.log(sql)
	await db.query(sql)
	return true
}


module.exports = login, register