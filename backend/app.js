const express = require("express");
const app = express();

const errorMiddleware = require("./middleWare/error")

app.use(express.json());

//Route Import 
const product = require("./routes/productRoute");

app.use("/api/v1",product);

//Middleware for error
app.use(errorMiddleware)

module.exports = app;