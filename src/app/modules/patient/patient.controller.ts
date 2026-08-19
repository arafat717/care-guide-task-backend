import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { patientService } from "./patient.service";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const patient = await patientService.getAllPatient(
    query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrived successfully",
    data: patient,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const userid = req.params.id;
  const payload = req.body;

  const user = await patientService.updatePatient(userid, payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Patient updated successfully",
    data: user,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { patientId } = req.params;
  await patientService.deletePatientFromDb(patientId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfully",
    data: null,
  });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  const { patientId } = req.params;
  await patientService.getSinglePatient(patientId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrived successfully!",
    data: null,
  });
});

export const patientController = {
  deletePatient,
  getAllPatient,
  updatePatient,
  getSinglePatient,
};
