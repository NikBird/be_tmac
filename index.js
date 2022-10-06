const app = require('./app');
const port = process.env.PORT || 3009

const { connectDatabase } = require("./src/utils/db");
connectDatabase().then(() => {console.log("Connected to DB. Initializing client."); });
require('./src/utils/db');
const server = app.listen(port, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
