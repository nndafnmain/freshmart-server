import { UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/validation.pipe";
import type { ZodSchema } from "zod";

export const ZodValidate = (schema: ZodSchema) =>
	UsePipes(new ZodValidationPipe(schema));
