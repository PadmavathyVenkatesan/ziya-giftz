import { Injectable } from '@angular/core';

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countryCodes: CountryCode[] = [
    {
      code: 'AL',
      name: 'Albania',
      flag: 'assets/images/country-flags/albania.svg',
      dialCode: '+355'
    },
    {
      code: 'IN',
      name: 'India',
      flag: 'assets/images/country-flags/india.svg',
      dialCode: '+91'
    },
    {
      code: 'US',
      name: 'United States',
      flag: 'assets/images/country-flags/usa.svg',
      dialCode: '+1'
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: 'assets/images/country-flags/uk.svg',
      dialCode: '+44'
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: 'assets/images/country-flags/uae.svg',
      dialCode: '+971'
    },
    {
      code: 'AU',
      name: 'Australia',
      flag: 'assets/images/country-flags/australia.svg',
      dialCode: '+61'
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: 'assets/images/country-flags/canada.svg',
      dialCode: '+1'
    },
    {
      code: 'SG',
      name: 'Singapore',
      flag: 'assets/images/country-flags/singapore.svg',
      dialCode: '+65'
    },
    {
      code: 'CN',
      name: 'China',
      flag: 'assets/images/country-flags/china.svg',
      dialCode: '+86'
    },
    {
      code: 'DE',
      name: 'Germany',
      flag: 'assets/images/country-flags/germany.svg',
      dialCode: '+49'
    },
    {
      code: 'KE',
      name: 'Kenya',
      flag: 'assets/images/country-flags/kenya.svg',
      dialCode: '+254'
    },
    {
      code: 'AT',
      name: 'Austria',
      flag: 'assets/images/country-flags/austria.svg',
      dialCode: '+43'
    }
  ];

  constructor() { }

  getAllCountries(): CountryCode[] {
    return this.countryCodes;
  }

  getCountryByCode(code: string): CountryCode | undefined {
    return this.countryCodes.find(country => country.code === code);
  }

  getCountryByDialCode(dialCode: string): CountryCode | undefined {
    return this.countryCodes.find(country => country.dialCode === dialCode);
  }
}
