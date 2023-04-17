import express from "express";
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcrypt");
import { NextFunction, RequestHandler, Response, Request } from "express";
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMid");
const Appointment = require("../models/appointmentModel");

export const getDoctorInfoByUserId = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
};

export const getDoctorInfoById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
};

export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      message: "Doctor info",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
};

export const getAppointmentByDoctorId = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({ doctor: doctor._id });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
};

export const changeAppointmentStatus =async (req:Request,res:Response) => {
   try {
     const { appointmentId, status } = req.body;
     const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
       status,
     });

     const user = await User.findOne({ _id: appointment.userId });
     const unseenNotifications = user.unseenNotifications;
     unseenNotifications.push({
       type: "appointment-status-changed",
       message: `Your appointment status has been ${status}`,
       onClickPath: "/appointment",
     });
     await user.save();

     res.status(200).send({
       message: "Appointment status updated successfully",
       success: true,
     });
   } catch (error) {
     console.log(error);
     res.status(500).send({
       message: "Error changing appointment status",
       success: false,
       error,
     });
   }
}