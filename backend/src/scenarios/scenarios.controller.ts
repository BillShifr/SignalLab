import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScenariosService } from './scenarios.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';

@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post()
  run(@Body() dto: CreateScenarioDto) {
    return this.scenariosService.run(dto);
  }

  @Get()
  findAll() {
    return this.scenariosService.findAll();
  }
}
