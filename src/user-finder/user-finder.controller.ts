import { Controller, Get } from '@nestjs/common';
import { UserFinderService } from './user-finder.service';

@Controller('user-finder')
export class UserFinderController {
  constructor(private readonly userFinderService: UserFinderService) {}

  @Get()
  async getUsersFromEurope() {
    return await this.userFinderService.getUsersFromEurope();
  }

  @Get('reputation')
  async getCountryByUsersReputation() {
    return await this.userFinderService.getCountryByUsersReputation();
  }

  @Get('best-user')
  async getBestUserForEachCountry() {
    return await this.userFinderService.getBestUserForEachCountry();
  }
}
