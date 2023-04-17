"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
connection.on("error", (error) => {
    console.log("Error connecting to MongoDB", error);
});
module.exports = mongoose;
