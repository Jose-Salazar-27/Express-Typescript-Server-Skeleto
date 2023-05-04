import axios from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { UserRepository } from '../repositories/user-repository';

const RoleLevel = {
  tryout: 1,
  academy: 2,
  first_team: 3,
  legend: 4,
};

interface Levels {
  tryout: number;
  academy: number;
  first_team: number;
  legend: number;
}

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

  async messagesByRole(roleName: string, level: string) {
    const user_level = RoleLevel[roleName as keyof Levels];
    const requested_level = RoleLevel[level as keyof Levels];

    console.log(`USER LEVEL ${user_level}`);
    console.log(`REQUESTED LEVEL ${requested_level}`);

    if (user_level < requested_level) {
      return null;
    } else {
      return await this.repository.messagesByRole(level);
    }
  }

  // TEMPORALMENTE VOY A USAR GA para referirme a los give aways
  public async getGAByRole(role: string) {
    return await this.repository.getGAByRole(role);
  }
}
