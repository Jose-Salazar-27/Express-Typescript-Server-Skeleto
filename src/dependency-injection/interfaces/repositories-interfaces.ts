import type { AxiosResponse } from 'axios';
import type { DiscordMessage } from '../../models/discord-messages-model';
import type { TDiscordUser } from '../../models/discord-user-model';

export interface IUserRepository<T = TDiscordUser, D = DiscordMessage> {
  findRole(username: string): Promise<AxiosResponse<T>>;
  messagesByRole(role: string): Promise<D[]>;
  getGiveAwayByRole(role: string): Promise<D[]>;
}

export interface ISocialMediaRepository {
  getInstagramPhoto(token: string): Promise<AxiosResponse>;
  getDiscordNews(limit: number): Promise<any[]>;
}
