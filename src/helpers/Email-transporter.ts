import nodemailer, { Transporter } from 'nodemailer';
import { ServerConfig } from '../config/server-config';
import { TokenHandler } from '../middleware/token-handler';

export class EmailTransporter extends ServerConfig {
  protected transporter: Transporter;
  static instance?: EmailTransporter;

  private constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.getEnvVar('EMAIL'),
        pass: this.getEnvVar('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(email: string, id: string) {
    const token = TokenHandler.getMiddleware().generate(email, id);
    const BASE_URL = this.getEnvVar('BASE_URL');

    return await this.transporter.sendMail({
      from: 'Tiento tester & devs',
      to: email,
      subject: 'Verify your email',
      text: `Greetings from the entire "tiento" team, please access the following link to verify your user on our platform. You only have to do it once.

      ${BASE_URL}/api/auth/verify/${token}
      
      `,
    });
  }

  static useTransport(): EmailTransporter {
    if (!this.instance) {
      this.instance = new EmailTransporter();
    }

    return this.instance;
  }
}
