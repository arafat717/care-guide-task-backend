import { Router } from "express";
import { checkAuth } from "../../utils/jwt";
import { Role } from "../doctor/doctor.interfce";
import { dashboardController } from "./dashboard.controller";

const router = Router();

// GET /dashboard/analytics?range=week|month|year|all  (or a raw number of days, e.g. range=90)
router.get(
  "/",
  checkAuth(Role.ADMIN),
  dashboardController.getAnalyticsOverview,
);

export const dashboardRoute = router;
