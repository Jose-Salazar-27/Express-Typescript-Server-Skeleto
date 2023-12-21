import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'inversify';
import { ServerConfig } from '../config/server-config';
import { TokenHandler } from '../middleware/token-handler';
import { generateCode } from './generate-code';
import { getEnv } from './getenv';

@injectable()
export class EmailTransporter {
  protected transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: getEnv('EMAIL'),
        pass: getEnv('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(email: string) {
    const code = generateCode();

    const emailResult = await this.transporter.sendMail({
      from: 'Tiento tester & devs',
      to: email,
      subject: 'Verify your email',
      text: `Greetings from the entire "tiento" team, here is Your code to finish your register process
      
      The code is: ${code}
      `,
    });

    return { code, emailResult };
  }
}
