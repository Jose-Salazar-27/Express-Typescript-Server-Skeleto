export interface IDiscordUser {
  roles: string[];
  user: {
    avatar: string;
    avatar_decoration: string | null;

    id: string;

    username: string;
  };
}

export type TDiscordUser = [IDiscordUser];
