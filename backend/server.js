const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");


//config

dotenv.config();

//Connecting to the database

connectDatabase()





let port = parseInt(process.env.PORT);
app.listen(port,() => {
    console.log(`Server is working on http://localhost:${port}`);
  });