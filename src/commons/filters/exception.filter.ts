// biome-ignore lint/style/useImportType: <explanation>
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";
import type { Response } from "express";

interface ValidationError {
	message: string;
	errors: { field: string; message: string }[];
}

export class ValidationException extends HttpException {
	constructor(error: ValidationError) {
		super(error, HttpStatus.BAD_REQUEST);
	}
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception instanceof ValidationException) {
			const exceptionResponse = exception.getResponse() as ValidationError;
			return response.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				timestamp: new Date().toISOString(),
				message: exceptionResponse.message,
				errors: exceptionResponse.errors,
				path: ctx.getRequest().url,
			});
		}

		if (exception instanceof ZodError) {
			return response.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				timestamp: new Date().toISOString(),
				message: "Validation failed",
				errors: exception.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})),
				path: ctx.getRequest().url,
			});
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			return response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				message: exception.message,
				path: ctx.getRequest().url,
			});
		}

		if (exception?.constructor?.name === "PrismaClientKnownRequestError") {
			return response.status(HttpStatus.BAD_REQUEST).json({
				statusCode: HttpStatus.BAD_REQUEST,
				timestamp: new Date().toISOString(),
				message: "Database error occurred",
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				error: (exception as any).message,
				path: ctx.getRequest().url,
			});
		}

		console.error(exception);
		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			timestamp: new Date().toISOString(),
			message: "Internal server error",
			path: ctx.getRequest().url,
		});
	}
}
