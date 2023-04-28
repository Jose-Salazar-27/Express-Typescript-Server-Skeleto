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
  async getUserRole(username: string) {
    const response = await axios.request({ ...this.axios_config, url: `/guilds/${this.guildId}/members/search?query=${username}` });
    return response.data;
  }

  async getAlphaPost() {
    const alphaEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.alpha}/messages` });
    const legendEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.legend}/messages` });
    const tryoutEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.tryout}/messages` });

    const responses = await axios.all([alphaEndpoint, legendEndpoint, tryoutEndpoint]);
    responses.forEach(r => console.table(r.data));

    return responses.map(r => r.data);
  }

  async getLegendPosts() {
    const legendEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.legend}/messages` });
    const tryoutEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.tryout}/messages` });

    const responses = await axios.all([legendEndpoint, tryoutEndpoint]);
    responses.forEach(r => console.table(r.data));

    return responses.map(r => r.data);
  }

  async getTryoutPosts() {
    const responses = await axios.request({ ...this.axios_config, url: `/channels/${this.channels.tryout}/messages` });
    // console.log(responses.request);

    console.table(responses.data);

    return responses.data;
  }

  // o dejo este que funciona para todos los roles
  async filterByRole(role: string) {
    const alphaEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.alpha}/messages` });
    const legendEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.legend}/messages` });
    const tryoutEndpoint = axios.request({ ...this.axios_config, url: `/channels/${this.channels.tryout}/messages` });

    const promises = [tryoutEndpoint, legendEndpoint, alphaEndpoint];

    switch (role) {
      case this.roles.alpha:
        const alpha_response = await axios.all(promises);

        return alpha_response.map(r => r.data);
        break;

      case this.roles.legend:
        const legend_response = await axios.all(promises.slice(0, 2));
        return legend_response.map(r => r.data);
        break;

      case this.roles.tryout:
        //
        const tryout_response = await tryoutEndpoint;
        return tryout_response.data;
        break;

      default:
        throw new Error('Role not provided');
        break;
    }
  }
}
