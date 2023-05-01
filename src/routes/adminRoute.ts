import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMid";
import {
  changeDoctorAccountStatus,
  getAllDoctors,
  getAllUsers,
} from "../controller/adminController";

router.get("/get-all-doctors", authMiddleware, getAllDoctors);

router.get("/get-all-users", authMiddleware, getAllUsers);

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  changeDoctorAccountStatus
);

export default router;
