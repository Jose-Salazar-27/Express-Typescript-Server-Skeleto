import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { TDiscordUser } from '../models/discord-user-model';
import { DiscordMessage } from '../models/discord-messages-model';
import { RoleNames, RoleNamesIndice } from '../helpers/roles';
import { guildId, discordChannelsId } from '../shared/constants/discord';
import { TYPES } from '../shared/constants';
import { getEnv } from '../helpers/getenv';

@injectable()
export class UserRepository {
  protected httpClient: AxiosInstance;
  constructor(@inject(TYPES.client.http) _axios: AxiosInstance) {
    this.httpClient = _axios;
  }

  public findRole(username: string): Promise<AxiosResponse<TDiscordUser>> {
    return this.httpClient.get(`/guilds/${guildId}/members/search?query=${username}`);
  }

  public async messagesByRole(role: string) {
    const rolesMap = {
      [RoleNames.LEGEND]: `/channels/${discordChannelsId.legend}/messages`,
      [RoleNames.FIRST_TEAM]: `/channels/${discordChannelsId.firstTeam}/messages`,
      [RoleNames.ACADEMY]: `/channels/${discordChannelsId.academy}/messages`,
      [RoleNames.TRYOUT]: `/channels/${discordChannelsId.tryout}/messages`,
    };

    const messageUrl = rolesMap[role as keyof RoleNamesIndice];
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
