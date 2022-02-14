import { Module } from '@nestjs/common';
import { UserFinderService } from './user-finder.service';
import { UserFinderController } from './user-finder.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { StackExchangeUsers } from '../stack-exchange-api/stack.exchange.users';
import { EuropeanCountriesNameScraper } from 'src/wikipedia-countries-name-scraper/european-countries-name-scraper';
import { CountriesNameScraper } from 'src/wikipedia-countries-name-scraper/countries-name-scraper';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserFinderController],
  providers: [
    UserFinderService,
    StackExchangeUsers,
    EuropeanCountriesNameScraper,
    CountriesNameScraper,
  ],
})
export class UserFinderModule {}
