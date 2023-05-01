import express from "express";
// const router = express.Router();
import User from"../models/userModel";
import Doctor from "../models/doctorModel";
// import bcrypt from "bcrypt";
import { Response, Request } from "express";
// import jwt from "jsonwebtoken";
// import authMiddleware from "../middleware/authMid";

export const getAllDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await Doctor.find({});
		res.status(200).send({
			message: "Doctors fetched successfully",
			success: true,
			data: doctors,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error applying doctor account",
			success: false,
			error,
		});
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({});
		res.status(200).send({
			message: "Users fetched successfully",
			success: true,
			data: users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error applying doctor account",
			success: false,
			error,
		});
	}
};

export const changeDoctorAccountStatus = async (
	req: Request,
	res: Response
) => {
	try {
		const { doctorId, status } = req.body;
		const doctor = await Doctor.findByIdAndUpdate(doctorId, {
			status,
		});

		const user:any = await User.findOne({ _id: doctor?.userId });
		const unseenNotifications:any = user?.unseenNotifications;
		unseenNotifications.push({
			type: "new-doctor-request-changed",
			message: `Your doctor account has been ${status}`,
			onClickPath: "/notifications",
		});
		user.isDoctor = status === "approved" ? true : false;
		await user.save();

		res.status(200).send({
			message: "Doctor status updated successfully",
			success: true,
			data: doctor,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error applying doctor account",
			success: false,
			error,
		});
	}
};
