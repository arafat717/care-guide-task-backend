import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { doctorRoute } from "../modules/doctor/doctor.route";
import { patientRoute } from "../modules/patient/patient.route";
import { dashboardRoute } from "../modules/dashboard/dashboard.route";



const router = Router();

const moduleRoutes = [
    {
        path: "/doctor",
        route: doctorRoute
    },
    {
        path: "/analytics",
        route: dashboardRoute
    },
    {
        path: "/patient",
        route: patientRoute
    },
    {
        path: "/auth",
        route: authRoutes
    },
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;