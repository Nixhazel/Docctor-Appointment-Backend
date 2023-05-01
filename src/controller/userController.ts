import express from "express";
import User from "../models/userModel";
import Doctor from "../models/doctorModel";
import Appointment from "../models/appointmentModel";
import bcrypt from "bcrypt";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
// import authMiddleware from "../middleware/authMid";
import moment from "moment";

const secret: string = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  //route : http://localhost:3000/users/register
  try {
    const userExists = await User.findOne({
      email: req.body.email,
    });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
      // To check if their is a user with the same email already
    }
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    // hashing the password for encryption purpose

    req.body.password = hashedPassword;

    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created Successfully", success: true });
    // created a new user
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  //http://localhost:3000/users/login
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
      // checking if the user is in the database
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
      // checking if the password is correct
    } else {
      const token = jwt.sign({ id: user._id }, secret, {
				expiresIn: "1d",
			});

      res
        .status(200)
        .send({ message: "Login Success", success: true, data: token });
      // sending the token to the user
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong", success: false, error });
  }
};

export const getUserInfoById = async (req: Request, res: Response) => {
  try {
    const user:any = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
      // checking if the user is in the database
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
      // sending the token to the user
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

export const applyDoctorAccount = async (req: Request, res: Response) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
  
    const unseenNotifications:any = adminUser?.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onclick: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser?._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
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

export const markAllNotificationsAsSeen = async (
  req: Request,
  res: Response
) => {
  try {
    const user:any = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
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

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const user:any = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
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

export const getAllApprovedDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
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

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    // pushing notification to doctor based on his userid
    const user:any = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `${req.body.userInfo.name} has booked an appointment with you`,
      onclickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
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

export const checkBookingAvailability = async (req: Request, res: Response) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
};

export const getAppointmentsByUserId = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
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
