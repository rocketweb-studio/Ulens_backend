import { Controller } from '@nestjs/common';
import { MainClientService } from './main-client.service';

@Controller('users')
export class MainClientController {
  constructor(private readonly mainClientService: MainClientService) {}
}
