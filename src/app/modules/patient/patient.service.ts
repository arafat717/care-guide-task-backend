import { QueryBuilder } from "../../utils/QueryBuilder";
import { IPatient } from "./patient.interface";
import { Patient } from "./patient.model";

const patientSearchableFields = ["name", "email", "Phone", "condition"];

const getAllPatient = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Patient.find(), query);
  const doctors = await queryBuilder
    .search(patientSearchableFields)
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

const updatePatient = async (patientId: string, payload: Partial<IPatient>) => {
  const isUserExist = await Patient.findById(patientId);
  if (!isUserExist) {
    throw new Error("Patient does not exist");
  }

  const newUpdatedUser = await Patient.findByIdAndUpdate(patientId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

const deletePatientFromDb = async (patientId: string) => {
  const patient = await Patient.findOne({ _id: patientId });
  if (!patient) {
    throw new Error("Patient not found!");
  }

  await Patient.findByIdAndDelete(patientId);
  return patient;
};

const getSinglePatient = async (patientId: string) => {
  const patient = await Patient.findOne({ _id: patientId });
  if (!patient) {
    throw new Error("Patient not found!");
  }
  return patient;
};

export const patientService = {
  getAllPatient,
  deletePatientFromDb,
  updatePatient,
  getSinglePatient,
};
