import { EmailTransporter } from '../Email-transporter';
import { request, server } from '../../config/test-setup';

const transporter = EmailTransporter.useTransport();

describe('Test email sender', () => {
  it('Should send a email with a token', async () => {
    const id = 'test id from jest';

    await transporter
      .sendEmail('joseandres61@gmail.com', id)
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
  });
});
