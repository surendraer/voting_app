const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

// set event listeners
db.on("connected", () => {
    console.log("database connected");
});

db.on("disconnected", () => {
    console.log("database disconnected");
});

db.on("error", (err) => {
    console.log("error in connecting: " + err);
});

module.exports = db;