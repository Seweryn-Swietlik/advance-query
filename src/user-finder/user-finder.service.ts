import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { StackExchangeUsers } from '../stack-exchange-api/stack.exchange.users';
import { EuropeanCountriesNameScraper } from 'src/wikipedia-countries-name-scraper/european-countries-name-scraper';
import { MoreThan } from 'typeorm';
import { CountriesNameScraper } from 'src/wikipedia-countries-name-scraper/countries-name-scraper';

@Injectable()
export class UserFinderService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private readonly stackExchangeUsers: StackExchangeUsers,
    private readonly europeanCountriesNameScraper: EuropeanCountriesNameScraper,
    private readonly countriesNameScraper: CountriesNameScraper,
  ) {
    this.initializeDatabaseWithHundredUsers();
  }

  async getUsersFromEurope() {
    const namesOfEuropeanCountries =
      await this.europeanCountriesNameScraper.scrapeEuropeanCountriesNames();
    const usersFromEuropeanCountries: Array<Promise<Array<User>>> = [];
    const query = this.userRepository.createQueryBuilder('user');
    namesOfEuropeanCountries.forEach((nameOfEuropeanCountries) => {
      query
        .where('LOWER(user.location) LIKE LOWER(:nameOfEuropeanCountries)', {
          nameOfEuropeanCountries: `%${nameOfEuropeanCountries}%`,
        })
        .andWhere({ bronze_badge_count: MoreThan(200) })
        .orderBy('user.name');
      const usersFromEuropeanCountry = query.getMany();
      usersFromEuropeanCountries.push(usersFromEuropeanCountry);
    });
    const resultsRaw = await Promise.all(usersFromEuropeanCountries);
    const results = resultsRaw.filter((result) => result.length > 0).flat();
    return results;
  }

  async getCountryByUsersReputation() {
    const usersByCountries = await this.getUsersFormEveryCountry();
    const reputationOfCountries = usersByCountries.map((usersByCountry) => {
      const totalReputation = usersByCountry.reduce((acc, user) => {
        acc += user.reputation;
        return acc;
      }, 0);
      return {
        name: usersByCountry[0].location,
        totalReputation,
      };
    });
    reputationOfCountries.sort(function (a, b) {
      return b.totalReputation - a.totalReputation;
    });
    return reputationOfCountries;
  }

  async getBestUserForEachCountry() {
    const usersByCountries = await this.getUsersFormEveryCountry();
    const theBestUsers = usersByCountries.map((usersByCountry) => {
      const sortedByReputation = usersByCountry.sort(function (a, b) {
        return b.reputation - a.reputation;
      });
      return sortedByReputation[0];
    });
    return theBestUsers;
  }

  private async getUsersFormEveryCountry() {
    const namesOfCountries =
      await this.countriesNameScraper.scrapeCountriesNames();
    const usersFromCountries: Array<Promise<Array<User>>> = [];
    const query = this.userRepository.createQueryBuilder('user');
    namesOfCountries.forEach((nameOfCountries) => {
      query.where('LOWER(user.location) LIKE LOWER(:nameOfCountries)', {
        nameOfCountries: `%${nameOfCountries}%`,
      });
      const usersFromCountry = query.getMany();
      usersFromCountries.push(usersFromCountry);
    });
    const resultsRaw = await Promise.all(usersFromCountries);
    const results = resultsRaw.filter((result) => result.length > 0);
    return results;
  }

  private async initializeDatabaseWithHundredUsers() {
    const user = await this.userRepository.findOne();
    if (!user) {
      const users: Array<Promise<User>> = [];
      const usersProperties =
        await this.stackExchangeUsers.preparePropertiesForHundredUsers();
      usersProperties.forEach((userProperties) => {
        const user = this.userRepository.create(userProperties);
        users.push(this.userRepository.save(user));
      });
      await Promise.allSettled(users);
    }
  }
}
