import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthService } from "./auth.service";

@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("login")
    login(@Body() body: {username: string, password: string}){
        return this.authService.login(body); 
    }
}
