const app = require("./app");
const dotenv = require("dotenv");


//config

dotenv.config();

let port = parseInt(process.env.PORT);





app.listen(port,() => {
    console.log(`Server is working on http://localhost:${port}`);
  });