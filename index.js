const database = require("./services/database");
const webServer = require("./services/webServer");

const init = async() => {
	try {
		await database.initPool();
		console.log("Database initialized");
	} catch(err) {
		console.log(err);
		process.exit(1);
	}

	try {
		await webServer.initServer();
		console.log("Web server initialized")
	} catch(err) {
		console.log(err);
		process.exit(1);
	}

};

init();


const shutdown = async(e) => {
	let err = e;

  try {
    await database.closePool();
  } catch (e) {
    console.error(e);

    err = err || e;
  }

  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.once('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.once('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

process.once('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});