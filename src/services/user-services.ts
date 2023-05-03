import axios from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { UserRepository } from '../repositories/user-repository';

export class UserService extends ConstraintsConfigurator {
  private readonly repository: UserRepository;
  constructor() {
    super();
    this.repository = new UserRepository();
  }

  getRoles() {
    return this.roles;
  }

  public async getUserRole(username: string) {
    const response = await this.repository.findRole(username);
    const role = response.data[0].roles;
    return role;
  }

  async messagesByRole(role: string) {
    return await this.repository.messagesByRole(role);
  }

  // TEMPORALMENTE VOY A USAR GA para referirme a los give aways
  public async getGAByRole(role: string) {
    return await this.repository.getGAByRole(role);
  }
}
