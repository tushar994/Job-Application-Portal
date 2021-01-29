const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const users = require("./routes/api/users");
const jobs = require("./routes/api/jobs");
const profiles = require("./routes/api/profiles");
const selection = require("./routes/api/selection");
const rate = require("./routes/api/rate");
const more_jobs = require("./routes/api/more_jobs");

const PORT = 4000;
const DB_NAME = "tutorial";

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// setup API endpoints
app.use("/api/users", users);
app.use("/api/jobs", jobs);
app.use("/api/profiles", profiles);
app.use("/api/selection", selection);
app.use("/api/rate", rate);
app.use("/api/more_jobs", more_jobs);

app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
