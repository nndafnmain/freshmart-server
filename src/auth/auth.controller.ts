import {
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
} from "@nestjs/common";
import { ZodValidate } from "src/commons/decorators/zod-validate.decorator";
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from "src/users/users.service";
// biome-ignore lint/style/useImportType: <explanation>
import { LoginDTO, RegisterDTO, registerSchema } from "./auth.schema";

@Controller("api/auth")
export class AuthController {
	constructor(private readonly userService: UsersService) {}

	@Post("/register")
	@ZodValidate(registerSchema)
	async register(
		@Body() {
			avatar,
			email,
			password,
			username,
		}: Omit<
			RegisterDTO,
			"id" | "createdAt" | "updatedAt" | "referralCode" | "role"
		>,
	) {
		const user = await this.userService.create({
			avatar,
			email,
			password,
			username,
		});
		return user;
	}

	@Post("/login")
	async login(@Body() { email, password }: LoginDTO) {
		const user = await this.userService.findOne({ email, password });
		if (!user) throw new UnauthorizedException("Invalid credentials");
		return this.userService.generateToken(user);
	}
}
