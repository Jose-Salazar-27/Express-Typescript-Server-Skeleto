import type { DiscordMessage } from '../../models/discord-messages-model';
import { CommunityMessage } from '../../shared/types';
import type { IUserRepository } from './repositories-interfaces';

export interface IUserService<T = DiscordMessage> {
  readonly repository: IUserRepository;
  getUserRole(username: string): Promise<string[]>;
  messagesByRole(roleName: string, level: string): Promise<T[] | null>;
  getGAByRole(role: string): Promise<T[]>;
}

export interface ISocialMediaService {
  getInstagramPhotos(): Promise<string[]>;
  getDiscordNews(limit: number): Promise<CommunityMessage[]>;
}
