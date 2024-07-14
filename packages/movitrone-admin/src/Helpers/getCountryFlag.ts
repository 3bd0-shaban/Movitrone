/***
 * @param {string} country_Code coutry code for country to return it's flag src image
 * @returns {string} flag src path
 **/
export function getCountryFlag(country_Code: string): string {
  return `/Images/flags/${country_Code.toLowerCase()}.svg`;
}
