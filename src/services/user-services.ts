import axios from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';

export class UserService extends ConstraintsConfigurator {
  constructor() {
    super();
  }

  getRoles() {
    return this.roles;
  }

  // Aqui no se si tener un metodo para cada role
  public async getUserRole(username: string) {
    const response = await axios.request({ ...this.axios_config, url: `/guilds/${this.guildId}/members/search?query=${username}` });
    return response.data;
  }

  // o dejo este que funciona para todos los roles
  async filterByRole(role: string) {
    const legend = axios.request({ ...this.axios_config, url: `/channels/${this.channels.legend}/messages` });
    const first_team = axios.request({ ...this.axios_config, url: `/channels/${this.channels.first_team}/messages` });
    const academy = axios.request({ ...this.axios_config, url: `/channels/${this.channels.academy}/messages` });
    const tryout = axios.request({ ...this.axios_config, url: `/channels/${this.channels.tryout}/messages` });

    const promises = [tryout, academy, first_team, legend];

    switch (role) {
      case this.roles.legend:
        const legend_response = await axios.all(promises);
        return legend_response.flatMap(res => res.data);
        break;

      case this.roles.first_team:
        const first_team_response = await axios.all(promises.slice(0, 3));
        return first_team_response.flatMap(res => res.data);
        break;

      case this.roles.academy:
        const academy_response = await axios.all(promises.slice(0, 2));
        return academy_response.flatMap(res => res.data);
        break;

      case this.roles.tryout:
        //
        const tryout_response = await tryout;
        return tryout_response.data;
        break;
      default:
        throw new Error('Role not provided');
        break;
    }
  }
}
