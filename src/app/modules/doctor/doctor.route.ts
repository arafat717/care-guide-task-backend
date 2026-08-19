import { Router } from "express";
import { validateRequest } from "../../middlewares/validationMiddleware";

import { checkAuth } from "../../utils/jwt";
import { Role } from "./doctor.interfce";
import { doctorController } from "./doctor.controller";
import { createDoctorValidationSchema } from "./doctor.validation";
import { createPatientValidationSchema } from "../patient/patient.validation";

const router = Router();

router.post(
  "/create-doctor",
  checkAuth(Role.ADMIN),
  validateRequest(createDoctorValidationSchema),
  doctorController.createDoctor,
);
router.get("/", checkAuth(Role.ADMIN), doctorController.getAllDoctor);

router.get(
  "/:doctorId/patients",
  checkAuth(Role.ADMIN),
  doctorController.getDoctorPatients,
);

router.get(
  "/:doctorId",
  checkAuth(Role.ADMIN),
  doctorController.getSingleDoctor,
);

router.post(
  "/:doctorId/patients",
  checkAuth(Role.ADMIN),
  validateRequest(createPatientValidationSchema),
  doctorController.addPatientUnderDoctor,
);

export const doctorRoute = router;
