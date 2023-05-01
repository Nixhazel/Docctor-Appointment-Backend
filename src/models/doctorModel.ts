import mongoose1 from "mongoose";

const doctorSchema = new mongoose1.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      // required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    feePerCunsultation: {
      type: Number,
      required: true,
    },
    timings:{
      type: Array,
      required: true,
    },
    status:{
      type: String,
      default: "pending",
    }
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose1.model("doctors", doctorSchema);

export default doctorModel;
