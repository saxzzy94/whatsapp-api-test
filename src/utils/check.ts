import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "./errorHandler";

export const errorCheck = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		let errorMessage = errors
			.array()
			.map((error: any) => `${error.param}: ${error.msg}`);
		return next(new AppError(errorMessage, 400, true));
	}
	next();
};
