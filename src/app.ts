import createError, {HttpError} from 'http-errors';
import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'
require('dotenv').config()
// import dbConfig from"./config/dbConfig"
import * as dotenv from "dotenv";
dotenv.config();
import { strict as assert } from "assert";
import { load } from "ts-dotenv";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);



const env = load({
	MONGO_URL: String,
	JWT_SECRET: String,
});

const url = process.env.MONGO_URL as string;

assert.ok(env.MONGO_URL === process.env.MONGO_URL);
assert.ok(env.JWT_SECRET === process.env.JWT_SECRET);

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

connection.on("error", (error: HttpError) => {
	console.log("Error connecting to MongoDB", error);
});



import indexRouter from './routes/adminRoute';
import usersRouter from './routes/users';
import doctorRouter from './routes/doctorsRoute'

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', indexRouter);
app.use('/users', usersRouter);
app.use('/doctors', doctorRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
