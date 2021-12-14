const oracledb = require('oracledb');
const dbConfig = require('../config.js');

// Tell node-oracledb where to find the Oracle Instant Client 'Basic' package on macOS and Windows
if (process.platform === 'darwin') {
  oracledb.initOracleClient({libDir: process.env.HOME + '/Downloads/instantclient_21_3'});
} else if (process.platform === 'win32') {
  oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_21_3'});   // note the double backslashes
} // else you must set the system library search path before starting Node.js

async function dbExecute(statement, binds = [], opts = {}) {
	let conn;
	let result = [];

	opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

	try {
		conn = await oracledb.getConnection(dbConfig.coffee);

		result = await conn.execute(statement, binds, opts);

		return (result);
	} catch (err) {
		console.error(err);
		throw(err);
	} finally {
		if (conn) {
			try {
				await conn.close();
			} catch (err) {
				console.error(err);
			}
		}
	}
}

module.exports.dbExecute = dbExecute;