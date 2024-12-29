import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { generateReferral } from "src/commons/libs/generateReferral";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async create({
		avatar,
		email,
		password,
		username,
	}: Omit<User, "id" | "createdAt" | "updatedAt" | "referralCode" | "role">) {
		const isEmailExist = await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (isEmailExist) throw new ConflictException("Email has been used!");

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await this.prisma.user.create({
			data: {
				email: email,
				username: username,
				password: hashedPassword,
				role: "USER",
				referralCode: generateReferral(),
				avatar: avatar
					? avatar
					: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw0Y_k6oo8_ga30TG6GnaiKyAv5-34TWVkvg&s",
			},
			select: {
				username: true,
				email: true,
				referralCode: true,
			},
		});

		if (!newUser) throw new BadRequestException("Failed to create data");

		return newUser;
	}

	async findOne({ email, password }: { email: string; password: string }) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				email: true,
				password: true,
				role: true,
			},
		});

		if (!user) throw new NotFoundException("Invalid credential");

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect)
			throw new BadRequestException("Invalid credential!");

		return user;
	}

	async generateToken(user: Pick<User, "id" | "email" | "role">) {
		const payload = {
			id: user.id,
			email: user.email,
			role: user.role,
		};
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
