// import necessary NestJS modules and dependencies
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
// import { Template, TemplateDocument } from '../models/template.model';

@Injectable()
export class PdfService {
  constructor(
    // @InjectModel('Template')
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}
  // private readonly templateModel: Model<TemplateDocument>,

  async generatePdf(htmlContent: string, filePath: string, scale: number) {
    // Retrieve API_KEY from ConfigService
    const apiKey = this.configService.get<string>('API_KEY');
    const tailwindCssUrl = `${apiKey}/public/assets/js/tailwind.js`;

    const tailwindCss = await fetch(tailwindCssUrl).then((response) =>
      response.text(),
    );

    // const template = await this.templateModel
    //   .findOne({ TemplateType: 'Invoice' })
    //   .exec();

    const html = `
      <script>${tailwindCss}</script>
      ${htmlContent}
    `;

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      scale,
      // footerTemplate: template.invoiceFooter,
      margin: {
        top: '30px',
        bottom: '100px',
        right: '30px',
        left: '30px',
      },
      pageRanges: '1-3',
    });

    await browser.close();

    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, pdfBuffer);
  }
}
