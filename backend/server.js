const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Uncaught Exception`);
  process.exit(1);
})



//config

dotenv.config();

//Connecting to the database

connectDatabase()





let port = parseInt(process.env.PORT);
const server =app.listen(port,() => {
    console.log(`Server is working on http://localhost:${port}`);
  });


// Unhandled promise rejections
process.on("unhandledRejection",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to unhandled Promise Rejection`);
  server.close(()=>{
    process.exit(1);
  });
});