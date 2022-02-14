import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CountriesNameScraper {
  private countriesUrl =
    'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population';

  constructor(private httpService: HttpService) {}

  async scrapeCountriesNames() {
    const data = await this.fetchCountry();
    const namesOfCountries: Array<string> = [];
    const $ = cheerio.load(data);
    const elemSelector =
      '#mw-content-text > div.mw-parser-output > table > tbody > tr';

    $(elemSelector).each((parentIdx, parentElem) => {
      $(parentElem)
        .children()
        .each((childIdx, childElem) => {
          if (childIdx === 1) {
            const nameOfCountryRaw = $(childElem).text();
            const nameOfCountry = nameOfCountryRaw.replace('[b]', '').trim();
            namesOfCountries.push(nameOfCountry);
          }
        });
    });
    namesOfCountries.shift();
    namesOfCountries.sort();
    return namesOfCountries;
  }

  private async fetchCountry() {
    const { data } = await firstValueFrom(
      this.httpService.get(this.countriesUrl),
    );
    return data;
  }
}

// const b = new HttpService();
// const a = new CountriesNameScraper(b);

// a.scrapeCountriesNames().then((res) => {
//   console.log(res);
// });
