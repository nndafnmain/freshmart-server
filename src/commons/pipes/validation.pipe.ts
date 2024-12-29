import type { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { ValidationException } from "src/commons/filters/exception.filter";
import type { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		const result = this.schema.safeParse(value);
		if (!result.success) {
			const formattedError = result.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			throw new ValidationException({
				message: "Validation Error",
				errors: formattedError,
			});
		}
		return result.data;
	}
}
