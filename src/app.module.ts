import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ExampleModule } from "./example/example.module";

@Module({
	imports: [AuthModule, UsersModule, ExampleModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
