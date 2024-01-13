import { inject, injectable } from 'inversify';
import { TYPES } from '../shared/constants';
import { SocialMediaRepository } from '../repositories/social-media-repository';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { HttpError } from '../exceptions/custom-error';
import { DiscordMessage } from '../models/discord-messages-model';
import { PromiseAllResult } from '../shared/types';
import { readToken } from '../helpers/token-utils';
import { getGuildName } from '../helpers/discord-utils';
import { dataSets } from '../shared/axiom/datasets';

@injectable()
export class SocialMediaService {
  private readonly repository: SocialMediaRepository;

  constructor(@inject(TYPES.Social_Media.repository) readonly _repo: SocialMediaRepository) {
    this.repository = _repo;
  }

  public async getInstagramPhotos() {
    const data = await this.repository.getInstagramPhoto(readToken());

    if (data.length < 1) {
      throw new HttpError({
        code: HttpStatusCode.ServiceUnavailable,
        dataSet: dataSets.api,
        message: 'cannot fetch ig posts',
      });
    }
  }

  // I'm not sure if I should to adapt message date to current user local date. Can be do on future phases
  public async getDiscordNews(limit: number) {
    // fetch messages from discord servers
    const rawMessages = <PromiseAllResult<AxiosResponse>[]>await this.repository.getDiscordNews(limit);
    // clean promise wrapper an merge response arrays
    const messages = rawMessages
      .filter((response) => response.status === 'fulfilled')
      .map((item) => <DiscordMessage>item.value?.data)
      .flat();
    // return only the information of interest
    return messages
      .map((msg) => {
        return {
          author: msg.author.username,
          content: cutDiscordPost(msg.content),
          date: new Date(msg.timestamp),
          channel_name: getGuildName(msg.channel_id),
          attachment: msg.attachments,
        };
      })
      .sort((a: any, b: any) => a.date - b.date)
      .reverse();
  }
}

const cutDiscordPost = (post: string) => {
  const limit = 300;
  return post.length > limit ? post.substring(0, limit) : post;
};
