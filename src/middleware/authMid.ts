import jwt from "jsonwebtoken";
import express, { NextFunction, Response, Request } from "express";

const secret: string = process.env.JWT_SECRET as string;

export  = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			name: "MissingTokenError",
			message: "No token was provided",
		});
	}
	try {
		// const token = req.headers["authorization"]?.split(" ")[1];
		// console.log("token", req.headers["authorization"]);
		jwt.verify(token, secret, (err: any, decoded: any) => {
			if (err) {
				return res
					.status(401)
					.send({ message: "Unauthorized", success: false });
			}
			req.body.userId = decoded.id;
			next();
		});
	} catch (error) {
		console.log(error);
		res.status(402).send({ message: "Something went wrong", success: false });
	}
};
