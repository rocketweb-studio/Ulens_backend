import { Controller } from '@nestjs/common';
import { MainClientService } from '@/microservices/main/main-client.service';

@Controller('users')
export class MainClientController {
  constructor(private readonly mainClientService: MainClientService) {}
}
