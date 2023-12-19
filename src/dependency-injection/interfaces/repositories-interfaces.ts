import type { AxiosResponse } from 'axios';
import type { DiscordMessage } from '../../models/discord-messages-model';
import type { TDiscordUser } from '../../models/discord-user-model';

export interface IUserRepository<T = TDiscordUser, D = DiscordMessage> {
  findRole(username: string): Promise<AxiosResponse<T>>;
  messagesByRole(role: string): Promise<D[]>;
  getGAByRole(role: string): Promise<D[]>;
}

export interface ISocialMediaRepository {
  getInstagramPhoto(index: number): string;
  getDiscordNews(limit: number): Promise<any[]>;
}
