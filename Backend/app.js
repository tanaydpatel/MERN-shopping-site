//dotenv for loading environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//initializing middleware
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Importing my routes
const authRoutes = require("./routes/auth");

const app = express();

//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB CONNECTED`);
  })
  .catch(() => {
    console.log("FAILED TO CONNECT");
  });

//setting up middleware in express with app.use()
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My routes
app.use("/api", authRoutes);

//port to run
const port = process.env.PORT;

//starting server
app.listen(port, () => {
  console.log(`app is running @ ${port}`);
});
