import countries from '../../public/data/countries.json';
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
