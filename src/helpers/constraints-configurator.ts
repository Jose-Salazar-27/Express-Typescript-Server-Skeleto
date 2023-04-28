import { AxiosRequestConfig } from 'axios';
import { ServerConfig } from '../config/server-config';

interface RoleSet {
  [key: string]: string;
  alpha: string;
  legend: string;
  tryout: string;
}

export abstract class ConstraintsConfigurator extends ServerConfig {
  public roles: RoleSet;
  public channels: RoleSet;
  protected token: string;
  protected axios_config: AxiosRequestConfig;
  protected guildId: string;

  constructor() {
    super();
    this.roles = this.setRoles();
    this.channels = this.setChannels();
    this.token = this.getEnvVar('BOT_TOKEN');
    this.axios_config = this.setRequestConfig();
    this.guildId = this.getEnvVar('DISCORD_GUILD_ID');
  }

  setRoles() {
    const roles = {
      alpha: this.getEnvVar('ALFA_ROLE_ID'),
      legend: this.getEnvVar('LEGEND_ROLE_ID'),
      tryout: this.getEnvVar('TRYOUT_ROLE_ID'),
    };
    return roles;
  }

  setChannels() {
    const channels = {
      alpha: this.getEnvVar('ALFA_CHANNEL'),
      legend: this.getEnvVar('LEGEND_CHANNEL'),
      tryout: this.getEnvVar('TRYOUT_CHANNEL'),
    };

    return channels;
  }

  setRequestConfig() {
    const config: AxiosRequestConfig = {
      baseURL: 'https://discord.com/api/v9',
      headers: {
        Authorization: `Bot ${this.token}`,
      },
      method: 'get',
    };

    return config;
  }
}
