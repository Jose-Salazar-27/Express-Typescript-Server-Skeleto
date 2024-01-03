import { inject, injectable } from 'inversify';
import { UserRepository } from '../repositories/user-repository';
import { TYPES } from '../shared/constants/identifiers';

const RoleLevel = {
  tryout: 1,
  academy: 2,
  first_team: 3,
  legend: 4,
};

@injectable()
export class UserService {
  public readonly repository: UserRepository;
  constructor(
    @inject(TYPES.UserRepository)
    _repository: UserRepository
  ) {
    this.repository = _repository;
  }

  public async getUserRole(username: string) {
    const response = await this.repository.findRole(username);

    const role = response.data[0].roles;
    return role;
  }

  async messagesByRole(roleName: string, level: string) {
    const user_level = RoleLevel[roleName as keyof object];
    const requested_level = RoleLevel[level as keyof object];

    if (user_level < requested_level) {
      return null;
    } else {
      return await this.repository.messagesByRole(level);
    }
  }

  // TEMPORALMENTE VOY A USAR GA para referirme a los give aways
  public async getGiveAwayByRole(role: string) {
    return await this.repository.getGiveAwayByRole(String(role));
  }
}
