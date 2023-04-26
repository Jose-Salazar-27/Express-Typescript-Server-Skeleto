declare namespace Express {
  export interface Request {
    payload: {
      token?: string;
      token_expires?: string;
      discord_id?: string;
      [key: string]: string;
    };
  }
}
