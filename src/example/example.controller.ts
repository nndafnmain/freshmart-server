import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "@prisma/client";
import { Rolesx } from "src/commons/decorators/roles.decorator";
import { JwtAuthGuard } from "src/commons/guards/jwt-auth.guard";
import { RolesGuard } from "src/commons/guards/roles.guard";

@Controller("example")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExampleController {
	@Get("/admin")
	@Rolesx(Roles.STORE_ADMIN)
	getExample() {
		return {
			message: "It's protected route",
		};
	}
}
