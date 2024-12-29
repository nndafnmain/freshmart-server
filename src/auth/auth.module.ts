import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RolesGuard } from "src/commons/guards/roles.guard";
import { JwtStrategy } from "src/commons/strategies/jwt.stratergy";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		UsersModule,
		forwardRef(() => UsersModule),
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" },
		}),
	],
	exports: [JwtModule, AuthService],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
