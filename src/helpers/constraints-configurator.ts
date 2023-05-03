import { AxiosRequestConfig } from 'axios';
import { ServerConfig } from '../config/server-config';

interface RoleSet {
  [key: string]: string;
  tryout: string;
  academy: string;
  first_team: string;
  legend: string;
}

export abstract class ConstraintsConfigurator extends ServerConfig {
  public roles: RoleSet;
  public channels: RoleSet;
  protected token: string;
  protected guildId: string;

  constructor() {
    super();
    this.roles = this.setRoles();
    this.channels = this.setChannels();
    this.token = this.getEnvVar('BOT_TOKEN');
    this.guildId = this.getEnvVar('DISCORD_GUILD_ID');
  }

  setRoles() {
    const roles = {
      tryout: this.getEnvVar('TRYOUT_ROLE_ID'),
      academy: this.getEnvVar('ACADEMY_ROLE_ID'),
      first_team: this.getEnvVar('FIRST_TEAM_ROLE_ID'),
      legend: this.getEnvVar('LEGEND_ROLE_ID'),
    };
    return roles;
  }
  setChannels() {
    const channels = {
      tryout: this.getEnvVar('TRYOUT_CHANNEL'),
      academy: this.getEnvVar('ACADEMY_CHANNEL'),
      first_team: this.getEnvVar('FIRST_TEAM_CHANNEL'),
      legend: this.getEnvVar('LEGEND_CHANNEL'),
    };

    return channels;
  }
}
