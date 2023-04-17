const mongoose = require("mongoose")
import createError, {HttpError} from 'http-errors';

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("Connected to MongoDB")
})

connection.on("error", (error: HttpError) => {
    console.log("Error connecting to MongoDB", error)
})

module.exports = mongoose;

