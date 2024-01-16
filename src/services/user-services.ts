import { inject, injectable } from 'inversify';
import { UserRepository } from '../repositories/user-repository';
import { TYPES } from '../shared/constants/identifiers';
import { getGuildName } from '../helpers/discord-utils';
import { HttpError } from '../exceptions/custom-error';
import { dataSets } from '../shared/axiom/datasets';
import { HttpStatusCode } from 'axios';

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

    const [user] = response;

    if (!user) {
      throw new HttpError({
        code: HttpStatusCode.NotFound,
        dataSet: dataSets.api,
        message: 'user not found',
      });
    }

    return user.roles;
  }

  async messagesByRole(requestLevel: string, userLevel: number) {
    const requested_level = RoleLevel[requestLevel as keyof object];

    // if requested level is lower that user role, reject the request
    if (userLevel < requested_level) {
      return null;
    } else {
      const rawMessages = await this.repository.messagesByRole(requestLevel);
      // return only relevant info
      return rawMessages.map((msg) => {
        const { author, channel_id, content, timestamp } = msg;
        return { author: author.username, channel_name: getGuildName(channel_id), content, timestamp };
      });
    }
  }

  // TEMPORALMENTE VOY A USAR GA para referirme a los give aways
  public async getGiveAwayByRole(role: string) {
    return await this.repository.getGiveAwayByRole(String(role));
  }
}
