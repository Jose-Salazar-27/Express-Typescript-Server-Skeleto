import type { AxiosInstance, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { IDiscordUser } from '../models/discord-user-model';
import { DiscordMessage } from '../models/discord-messages-model';
import { guildId, discordChannelsId } from '../shared/constants/discord';
import { TYPES } from '../shared/constants';

@injectable()
export class UserRepository {
  protected httpClient: AxiosInstance;
  constructor(@inject(TYPES.client.http) _axios: AxiosInstance) {
    this.httpClient = _axios;
  }

  public async findRole(username: string): Promise<IDiscordUser[]> {
    const user = await this.httpClient.get(`/guilds/${guildId}/members/search?query=${username}`);
    return user.data;
  }

  public async messagesByRole(level: string) {
    const rolesMap = {
      tryout: `/channels/${discordChannelsId.giveAway.tryout}/messages`,
      academy: `/channels/${discordChannelsId.giveAway.academy}/messages`,
      first_team: `/channels/${discordChannelsId.giveAway.first_team}/messages`,
      legend: `/channels/${discordChannelsId.giveAway.legend}/messages`,
    };

    const messageUrl = rolesMap[level as keyof object];
    const response = await this.httpClient.get<DiscordMessage[]>(messageUrl);

    return response.data;
  }

  // make sure that role is string
  public async getGiveAwayByRole(role: string) {
    const ids = Object.keys(discordChannelsId.giveAway);
    const index = ids.indexOf(role);

    if (index < 0) {
      throw new Error(`Invalid role: ${role}`);
    }

    const response: AxiosResponse<DiscordMessage[]> = await this.httpClient.get(`/channels/${ids[index]}/messages`);
    return response.data;
  }
}
