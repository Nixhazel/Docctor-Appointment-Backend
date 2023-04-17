const jwt = require("jsonwebtoken");
import express, { NextFunction, Response, Request } from "express";

module.exports = async (req: Request, res: Response, next: NextFunction) => {
try {
  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("token", req.headers["authorization"]);
  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized", success: false });
    }
    req.body.userId = decoded.id;
    next();
  })
} catch (error) {
  console.log(error);
  res.status(402).send({ message: "Something went wrong", success: false });
}
}