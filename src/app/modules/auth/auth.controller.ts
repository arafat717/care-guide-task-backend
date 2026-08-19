/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.userLogin(req.body);

    res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: false
    })

    res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: false
    })

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        data: user
    });
});


const createNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const user = await authService.createNewAccessToken(refreshToken as string);
    res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: false
    })
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Refresh token created successfully!",
        data: user
    });
});


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Refresh token created successfully!",
        data: undefined
    });

});


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await authService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password Changed successfully!",
        data: undefined
    });

});






export const AuthController = {
    loginUser,
    createNewAccessToken,
    logout,
    changePassword
};