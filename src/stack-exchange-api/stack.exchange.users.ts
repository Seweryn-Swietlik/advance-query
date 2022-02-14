import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserProperties } from '../user-finder/types/types';

@Injectable()
export class StackExchangeUsers {
  private usersApiUrl =
    'https://api.stackexchange.com/2.3/users?pagesize=100&order=desc&sort=reputation&site=stackoverflow&filter=!-Ox7ruHE8sv2Lx9pV9rPCIA-MkRmnW9UE';

  constructor(private httpService: HttpService) {}

  async preparePropertiesForHundredUsers(): Promise<Array<UserProperties>> {
    const users = await this.fetchUsers();
    const items = users.items;
    const usersProperties: Array<UserProperties> = [];
    items.forEach((item) => {
      const { badge_counts, account_id, reputation, link, display_name } = item;
      let { location } = item;
      if (!location) {
        location = '';
      }
      const bronze_badge_count = badge_counts.bronze;
      usersProperties.push({
        name: display_name,
        location,
        bronze_badge_count,
        account_id,
        reputation,
        link,
      });
    });
    return usersProperties;
  }

  private async fetchUsers() {
    const result = await firstValueFrom(this.httpService.get(this.usersApiUrl));
    return result.data;
  }
}
