const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connect } = require("mongoose");
const authMiddleware = require("./middleware/middle wareAuth");



dotenv.config();

const app = express();

//middle ware to parse JSON request bodies
app.use(express.json());

// middle ware that logs the request method, URL, and timestamp
const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

app.use(logger);
//conncetDB
connectDB();
//routes
app.use("/products",authMiddleware, require("./routes/productRoute"));
//default route
app.get("/", (req,res) =>{
    res.send("Hi this is Kelvin Kipchumba chasing greatness...")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));