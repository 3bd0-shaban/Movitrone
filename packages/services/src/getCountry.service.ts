import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeoService {
  async getCountry(req: Request): Promise<iGeoCountry | string> {
    const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
    const geo = geoip.lookup(ip);

    if (!geo) {
      return 'No country data found';
    }

    const getDisplayName = (type: Intl.DisplayNamesType) =>
      new Intl.DisplayNames(['en'], { type }).of(geo?.country);

    const country = getDisplayName('region');
    const language = getDisplayName('language');

    const result: iGeoCountry = {
      country,
      code: geo.country,
      city: geo.city,
      region: geo.region,
      timezone: geo.timezone,
      language,
    };

    return result;
  }
}

export interface iGeoCountry {
  country: string | undefined;
  code: string | undefined;
  city: string | undefined;
  region: string | undefined;
  language: string | undefined;
  timezone: string | undefined;
}
