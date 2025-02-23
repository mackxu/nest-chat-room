import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }
  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '聊天室',
        address: this.configService.get('EMAIL_USER'),
      },
      html,
      to,
      subject,
    });
  }
}
