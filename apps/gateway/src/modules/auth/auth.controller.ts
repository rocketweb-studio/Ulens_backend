import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller('auth')

export class AuthController {
    constructor(@Inject("AUTH-SERVICE") private readonly authClient: ClientProxy){}

    @Post("login")
    async login(@Body() body: {username: string, password: string}){
        return await firstValueFrom(this.authClient.send("auth-login", body))
    }
}
