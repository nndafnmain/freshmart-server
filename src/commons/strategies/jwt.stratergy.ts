import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Roles } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";

interface IPayload {
	id: number;
	email: string;
	role: Roles;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: IPayload) {
		return {
			id: payload.id,
			email: payload.email,
			role: payload.role,
		};
	}
}
