

const dotenv = require("dotenv");


//config

dotenv.config();

let port = parseInt(process.env.PORT);

const app = require("./app");




app.listen(port,() => {
    console.log(`Server is working on http://localhost:${port}`);
  });