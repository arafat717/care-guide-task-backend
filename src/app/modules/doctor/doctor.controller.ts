import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { doctorService } from "./doctor.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const user = await doctorService.createDoctorIntoDb(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: user,
  });
});

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = await doctorService.getAllFromDoctor(
    query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Doctors retrived successfully",
    data: user,
  });
});

const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const query = req.query;
  const patients = await doctorService.getDoctorPatients(
    doctorId,
    query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: patients,
  });
});

const addPatientUnderDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const patient = await doctorService.addPatientToDoctor(doctorId, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Patient added successfully",
      data: patient,
    });
  },
);

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const patient = await doctorService.getSigleDoctor(doctorId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Doctor data retrived successfully",
    data: patient,
  });
});

export const doctorController = {
  createDoctor,
  getAllDoctor,
  addPatientUnderDoctor,
  getDoctorPatients,
  getSingleDoctor,
};
