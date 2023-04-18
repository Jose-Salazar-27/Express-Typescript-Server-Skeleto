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

  async sendEmail(email: string) {
    const token = TokenHandler.getMiddleware().generate();

    const emailResult = await this.transporter.sendMail({
      from: 'Tiento tester & devs',
      to: email,
      subject: 'Verify your email',
      text: `Greetings from the entire "tiento" team, here is Your code to finish your register process
      
      The code is: ${token}
      `,
    });

    console.log(token, emailResult);
    return { token, emailResult };
  }

  static useTransport(): EmailTransporter {
    if (!this.instance) {
      this.instance = new EmailTransporter();
    }

    return this.instance;
  }
}
