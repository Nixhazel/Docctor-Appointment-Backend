import express from "express";
const router = express.Router();
import {
  applyDoctorAccount,
  bookAppointment,
  checkBookingAvailability,
  deleteAllNotifications,
  getAllApprovedDoctors,
  getAppointmentsByUserId,
  getUserInfoById,
  login,
  markAllNotificationsAsSeen,
  register,
} from "../controller/userController";
import authMiddleware from "../middleware/authMid";

router.post("/register", register);

router.post("/login", login);

router.post("/get-user-info-by-id", authMiddleware, getUserInfoById);

router.post("/apply-doctor-account", authMiddleware, applyDoctorAccount);

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  markAllNotificationsAsSeen
);

router.post(
  "/delete-all-notifications",
  authMiddleware,
  deleteAllNotifications
);

router.get("/get-all-approved-doctors", authMiddleware, getAllApprovedDoctors);

router.post("/book-appointment", authMiddleware, bookAppointment);

router.post(
  "/check-booking-availability",
  authMiddleware,
  checkBookingAvailability
);

router.get(
  "/get-appointments-by-user-id",
  authMiddleware,
  getAppointmentsByUserId
);

export default router;
