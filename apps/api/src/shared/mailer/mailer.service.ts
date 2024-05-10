import { Inject, Injectable } from '@nestjs/common';

import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppConfig, IAppConfig } from 'src/config';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { randomValue } from '~/utils/tool.util';

@Injectable()
export class MailerService {
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

  async sendVerificationCode(to, code = randomValue(4, '1234567890')) {
    const subject = `[${this.appConfig.name}] 验证码`;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: './verification-code-zh',
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
