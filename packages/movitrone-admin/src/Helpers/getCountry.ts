import countries from '../../../movitrone-admin1/public/data/countries.json';
import { iCountry } from '../types/iCountry';

/**
 *
 * @param {string} countryCode
 *
 * @returns {iCountry} country data
 */
export function getCountryByCode(countryCode: string): iCountry | null {
  for (const country of countries) {
    if (country.code === countryCode) {
      return country as any;
    }
  }
  return null;
}

/**
 *
 * @param {string} countryName
 *
 * @returns {iCountry} country data
 */
export function getCountryCode(countryName: string): iCountry | null {
  for (const country of countries) {
    if (country.country === countryName) {
      return country as any;
    }
  }
  return null;
}
