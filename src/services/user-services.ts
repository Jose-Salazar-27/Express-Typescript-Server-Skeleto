import axios from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';

export class UserService extends ConstraintsConfigurator {
  constructor() {
    super();
  }

  getRoles() {
    return this.roles;
  }

  async getAlphaPost() {
    const alphaEndpoint = axios.request({ ...this.axios_config, url: `/${this.channels.alpha}/messages` });
    const legendEndpoint = axios.request({ ...this.axios_config, url: `/${this.channels.legend}/messages` });
    const tryoutEndpoint = axios.request({ ...this.axios_config, url: `/${this.channels.tryout}/messages` });
    // const legendEndpoint = axios.get(`https://discord.com/api/v9/channels/${this.channels.legend}/messages`);
    // const tryoutEndpoint = axios.get(`https://discord.com/api/v9/channels/${this.channels.tryout}/messages`);

    const responses = await axios.all([alphaEndpoint, legendEndpoint, tryoutEndpoint]);
    responses.forEach(r => console.log(r.data));

    return responses.map(r => r.data);
  }

  async getLegendPosts() {
    const legendEndpoint = axios.request({ ...this.axios_config, url: `/${this.channels.legend}/messages` });
    const tryoutEndpoint = axios.request({ ...this.axios_config, url: `/${this.channels.tryout}/messages` });

    const responses = await axios.all([legendEndpoint, tryoutEndpoint]);

    return responses.map(r => r.data);
  }

  async getTryoutPosts() {
    const responses = await axios.request({ ...this.axios_config, url: `/${this.channels.tryout}/messages` });

    return responses.data;
  }
}
