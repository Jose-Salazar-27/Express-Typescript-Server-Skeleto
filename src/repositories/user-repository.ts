import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { TDiscordUser } from '../models/discord-user-model';
import { DiscordMessage } from '../models/discord-messages-model';
import { RoleNames } from '../helpers/roles';

export class UserRepository extends ConstraintsConfigurator {
  protected httpClient: AxiosInstance;
  constructor() {
    super();
    this.httpClient = this.setHttpClient();
  }

  public findRole(username: string): Promise<AxiosResponse<TDiscordUser>> {
    return this.httpClient.get(`/guilds/${this.guildId}/members/search?query=${username}`);
  }

  // returns  Promise<AxiosResponse<IDiscordUser[] | IDiscordUser>>
  public async messagesByRole(role: string) {
    const legend = this.httpClient.get(`/channels/${this.channels.legend}/messages`);
    const first_team = this.httpClient.get(`/channels/${this.channels.first_team}/messages`);
    const academy = this.httpClient.get(`/channels/${this.channels.academy}/messages`);
    const tryout = this.httpClient.get(`/channels/${this.channels.tryout}/messages`);

    switch (role) {
      case RoleNames.LEGEND:
        const legend_response: AxiosResponse<DiscordMessage[]> = await legend;
        return legend_response.data;
        break;

      case RoleNames.FIRST_TEAM:
        const first_team_response: AxiosResponse<DiscordMessage[]> = await first_team;
        return first_team_response.data;
        break;

      case RoleNames.ACADEMY:
        const academy_response: AxiosResponse<DiscordMessage[]> = await academy;
        return academy_response.data;

      case RoleNames.TRYOUT:
        //
        const tryout_response: AxiosResponse<DiscordMessage[]> = await tryout;
        return tryout_response.data;
        break;

      default:
        throw new Error('Role not provided');
        break;
    }
  }

  // GA = GIVE AWAY
  public async getGAByRole(role: string) {
    const urls = {
      [this.roles.legend]: `/channels/${this.giveAways.legend}/messages`,
      [this.roles.first_team]: `/channels/${this.giveAways.first_team}/messages`,
      [this.roles.academy]: `/channels/${this.giveAways.academy}/messages`,
      [this.roles.tryout]: `/channels/${this.giveAways.tryout}/messages`,
    };

    const url = urls[role];
    if (!url) {
      throw new Error(`Invalid role: ${role}`);
    }

    const response: AxiosResponse<DiscordMessage[]> = await this.httpClient.get(url);
    return response.data;
  }

  setHttpClient(): AxiosInstance {
    return axios.create({
      baseURL: 'https://discord.com/api/v9',
      headers: {
        Authorization: `Bot ${this.token}`,
      },
    });
  }
}
