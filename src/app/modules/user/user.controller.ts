/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUserIntoDb(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
});


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_SECRET as string);
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await userService.updateUser(userid, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User updated successfully",
        data: user
    });
});


const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getAllUsersIntoDb();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrived successfully",
        data: user
    });
});


export const UserController = {
    createUser,
    getAllUser,
    updateUser
};