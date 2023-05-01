import express from "express";
const router = express.Router();
import { changeAppointmentStatus, getAppointmentByDoctorId, getDoctorInfoById, getDoctorInfoByUserId, updateDoctorProfile } from "../controller/doctorController";
import authMiddleware from "../middleware/authMid";


router.post("/get-doctor-info-by-user-id", authMiddleware, getDoctorInfoByUserId);

router.post("/get-doctor-info-by-id", authMiddleware, getDoctorInfoById);

router.post("/update-doctor-profile", authMiddleware, updateDoctorProfile);

router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  getAppointmentByDoctorId
);

router.post(
  "/change-appointment-status",
  authMiddleware,
  changeAppointmentStatus
);

export default router;
