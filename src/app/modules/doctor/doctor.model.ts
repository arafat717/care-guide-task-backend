import { model, Schema } from "mongoose";
import { IDoctor, Role } from "./doctor.interfce";

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      enum: Object.values(Role),
      default: Role.DOCTOR,
      type: String,
    },
    phone: { type: String },
    specialization: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
