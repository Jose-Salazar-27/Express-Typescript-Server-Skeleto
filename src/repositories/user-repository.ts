import axios, { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ConstraintsConfigurator } from "../helpers/constraints-configurator";
import { TDiscordUser } from "../models/discord-user-model";
import { DiscordMessage } from "../models/discord-messages-model";
import { RoleNames, RoleNamesIndice } from "../helpers/roles";

@injectable()
export class UserRepository extends ConstraintsConfigurator {
  protected httpClient: AxiosInstance;
  constructor() {
    super();
    this.httpClient = this.setHttpClient();
  }

  public findRole(username: string): Promise<AxiosResponse<TDiscordUser>> {
    return this.httpClient.get(
      `/guilds/${this.guildId}/members/search?query=${username}`
    );
  }

  // returns  Promise<AxiosResponse<IDiscordUser[] | IDiscordUser>>
  public async messagesByRole(role: string) {
    const rolesMap = {
      [RoleNames.LEGEND]: `/channels/${this.channels.legend}/messages`,
      [RoleNames.FIRST_TEAM]: `/channels/${this.channels.first_team}/messages`,
      [RoleNames.ACADEMY]: `/channels/${this.channels.academy}/messages`,
      [RoleNames.TRYOUT]: `/channels/${this.channels.tryout}/messages`,
    };

    const messageUrl = rolesMap[role as keyof RoleNamesIndice];
    const response = await this.httpClient.get<DiscordMessage[]>(messageUrl);

    return response.data;
  }

  // GA = GIVE AWAY
  public async getGAByRole(role: string) {
    const urls = {
      [this.roles.legend]: `/channels/${this.giveAways.legend}/messages`,
      [this.roles
        .first_team]: `/channels/${this.giveAways.first_team}/messages`,
      [this.roles.academy]: `/channels/${this.giveAways.academy}/messages`,
      [this.roles.tryout]: `/channels/${this.giveAways.tryout}/messages`,
    };

    const url = urls[role];
    if (!url) {
      throw new Error(`Invalid role: ${role}`);
    }

    const response: AxiosResponse<DiscordMessage[]> = await this.httpClient.get(
      url
    );
    return response.data;
  }

  setHttpClient(): AxiosInstance {
    return axios.create({
      baseURL: "https://discord.com/api/v9",
      headers: {
        Authorization: `Bot ${this.token}`,
      },
    });
  }
}
