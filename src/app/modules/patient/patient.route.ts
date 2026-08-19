import { Router } from "express";

import { checkAuth } from "../../utils/jwt";
import { patientController } from "./patient.controller";
import { Role } from "../doctor/doctor.interfce";
import { updatePatientValidationSchema } from "./patient.validation";
import { validateRequest } from "../../middlewares/validationMiddleware";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), patientController.getAllPatient);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updatePatientValidationSchema),
  patientController.updatePatient,
);

router.get(
  "/:patientId",
  checkAuth(Role.ADMIN),
  patientController.getSinglePatient,
);

router.delete(
  "/:patientId",
  checkAuth(Role.ADMIN),
  patientController.deletePatient,
);

export const patientRoute = router;
