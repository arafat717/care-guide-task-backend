import { QueryBuilder } from "../../utils/QueryBuilder";
import { IPatient } from "../patient/patient.interface";
import { Patient } from "../patient/patient.model";
import { IDoctor } from "./doctor.interfce";
import { Doctor } from "./doctor.model";

const doctorSearchableFields = ["name", "email", "phone", "specialization"];
const patientSearchableFields = ["name", "email", "phone", "condition"];

const getAllFromDoctor = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Doctor.find(), query);
  const doctors = await queryBuilder
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    doctors.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

const createDoctorIntoDb = async (payload: IDoctor) => {
  const { email, ...rest } = payload;

  const isEmailExist = await Doctor.findOne({ email });
  if (isEmailExist) {
    throw new Error("User with this email already exists");
  }

  const user = await Doctor.create({ email, ...rest });
  return user;
};

const getSigleDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findOne({ doctorId });

  return doctor;
};

const getDoctorPatients = async (
  doctorId: string,
  query: Record<string, string>,
) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const queryBuilder = new QueryBuilder(
    Patient.find({ doctor: doctorId }),
    query,
  );
  const patients = await queryBuilder
    .search(patientSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    patients.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

const addPatientToDoctor = async (
  doctorId: string,
  payload: Omit<IPatient, "doctor" | "appointmentDate">,
) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const patient = await Patient.create({
    ...payload,
    doctor: doctorId,
    appointmentDate: new Date(),
  });

  return patient;
};

export const doctorService = {
  getAllFromDoctor,
  createDoctorIntoDb,
  getDoctorPatients,
  addPatientToDoctor,
  getSigleDoctor,
};
