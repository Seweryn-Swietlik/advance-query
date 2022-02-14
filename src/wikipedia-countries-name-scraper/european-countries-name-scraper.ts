import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EuropeanCountriesNameScraper {
  private europeanCountriesUrl =
    'https://en.wikipedia.org/wiki/List_of_European_countries_by_area';

  constructor(private httpService: HttpService) {}

  async scrapeEuropeanCountriesNames(): Promise<Array<string>> {
    const data = await this.fetchCountry();
    const namesOfEuropeanCountries: Array<string> = [];
    const $ = cheerio.load(data);
    const elemSelector =
      '#mw-content-text > div.mw-parser-output > table > tbody > tr';

    $(elemSelector).each((parentIdx, parentElem) => {
      $(parentElem)
        .children()
        .each((childIdx, childElem) => {
          if (childIdx === 1) {
            const nameOfEuropeanCountryRaw = $(childElem).text();
            const nameOfEuropeanCountry = nameOfEuropeanCountryRaw
              .replace(/[*\n]/g, '')
              .trim();
            namesOfEuropeanCountries.push(nameOfEuropeanCountry);
          }
        });
    });
    namesOfEuropeanCountries.shift();
    namesOfEuropeanCountries.sort();
    return namesOfEuropeanCountries;
  }

  private async fetchCountry() {
    const { data } = await firstValueFrom(
      this.httpService.get(this.europeanCountriesUrl),
    );
    return data;
  }
}
