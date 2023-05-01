import mongoose2 from "mongoose";

const appointmentSchema = new mongoose2.Schema({
  userId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  doctorInfo: {
    type: Object,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
},
{
  timestamps: true,
});

const appointmentModel = mongoose2.model("appointments", appointmentSchema);

export default appointmentModel;
