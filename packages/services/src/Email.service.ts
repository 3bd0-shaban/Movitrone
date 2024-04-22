// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Initialize transporter with createTransport from nodemailer
    this.transporter = nodemailer.createTransport({
      host: 'mail.ftlerates.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_TO_SEND'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(to: string, txt: string, otp: string): Promise<void> {
    const emailOptions = {
      from: this.configService.get<string>('EMAIL_TO_SEND'),
      to,
      subject: 'Erates',
      html: `
        <div style="max-width: 700px; margin:auto;text-align: center; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;margin-left: auto;margin-right: auto;">
          <h2 style="text-align: center; text-transform: uppercase;color:#DC2626;">Welcome to</h2>
          <img src="cid:logo" style="width:8rem;height:2rem;">
          <p>${txt}</p>
          <p>${otp}</p>
          <p>If it doesn't work for any reason, return to the website and ask for another OTP code</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(emailOptions);
      console.log('Message sent: ' + info.messageId);
    } catch (err) {
      console.error('nodemailer Error:', err.message);
      throw err; // Propagate the error to the calling code if needed
    }
  }
}
