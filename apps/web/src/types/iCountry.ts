export interface iCountry {
  _id?: string;
  countryId?: string;
  code?: string;
  capital?: string;
  region?: string;
  currency?: {
    code?: string;
    name?: string;
    symbol?: string;
  };
  language?: {
    code?: string;
    name?: string;
  };
  flag?: string | null;
  dialling_code?: string;
  country?: string;
  isSEO?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
