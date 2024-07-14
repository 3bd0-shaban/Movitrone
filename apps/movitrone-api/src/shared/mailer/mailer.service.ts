import { Inject, Injectable } from '@nestjs/common';

import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppConfig, IAppConfig } from '~/config';
import { ErrorEnum } from '~/constants/error-code.constant';

@Injectable()
export class EmailService {
  constructor(
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
    private mailerService: NestMailerService,
  ) {}

  async send(
    to: string,
    subject: string,
    content: string,
    type: 'text' | 'html' = 'text',
  ): Promise<any> {
    if (type === 'text') {
      return this.mailerService.sendMail({
        to,
        subject,
        text: content,
      });
    } else {
      return this.mailerService.sendMail({
        to,
        subject,
        html: content,
      });
    }
  }

  async sendVerificationCode(to: string, code: string) {
    const subject = `[${this.appConfig.name}] email verification code`;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: './verification-code',
        context: {
          code,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        ErrorEnum.VERIFICATION_CODE_SEND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      to,
      code,
    };
  }
}
