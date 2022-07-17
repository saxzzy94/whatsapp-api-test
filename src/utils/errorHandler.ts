import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
	status: any;
	statusCode;
	isOperational: boolean;
	constructor(message: any, statusCode: number, operational: boolean) {
		super(message);
		this.statusCode = statusCode;
		this.status = "error";
		this.isOperational = operational;
		Error.captureStackTrace(this, this.constructor);
	}
}
export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (err.isOperational) {
		console.log("Operational Error", err);
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}

	// send generic message

	return res.status(500).json({
		status: "error",
		message: "something went wrong",
		err,
	});
};
