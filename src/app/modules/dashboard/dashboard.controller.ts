import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { dashboardService } from "./dashboard.service";

const getAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getAnalyticsOverview(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard analytics retrieved successfully",
    data: result,
  });
});

export const dashboardController = {
  getAnalyticsOverview,
};
