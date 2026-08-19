import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.createNewAccessToken);
router.post("/logout", AuthController.logout);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);


export const authRoutes = router;  