import { JwtPayload } from 'jsonwebtoken';

export interface Token extends JwtPayload {
  email: string;
  id: string;
}
