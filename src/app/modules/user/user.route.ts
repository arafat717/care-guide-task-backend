import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validationMiddleware";
import { createUserSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../utils/jwt";

const router = Router()

router.post("/register", validateRequest(createUserSchema), UserController.createUser);
router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUser);
router.patch('/:id',checkAuth(...Object.values(Role)), UserController.updateUser)

export const userRoutes = router;