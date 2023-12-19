import { inject, injectable } from 'inversify';
import { SupabaseClient } from '@supabase/supabase-js';
import { PublicUrlResponse } from '../models/supabase-response';
import { HttpCodes, HttpException } from '../exceptions/custom-error';
import { TYPES, buckets } from '../shared/constants';
import { DiscordMessage } from '../models/discord-messages-model';
import { AxiosInstance } from 'axios';
import { discordChannelsId } from '../shared/constants/discord';

@injectable()
export class SocialMediaRepository {
  private readonly supabase: SupabaseClient;
  private readonly client: AxiosInstance;

  constructor(
    @inject(TYPES.client.supabase) _supabase: SupabaseClient,
    @inject(TYPES.client.http) _axios: AxiosInstance
  ) {
    this.supabase = _supabase;
    this.client = _axios;
  }

  public getInstagramPhoto(index: number): string {
    const allowedindexes = [0, 1, 2, 3, 4, 5];

    if (!allowedindexes.includes(index)) {
      throw new HttpException({
        code: HttpCodes.BAD_REQUEST,
        message: 'invalid param',
      });
    }

    const { data }: PublicUrlResponse = this.supabase.storage
      .from(buckets.images)
      .getPublicUrl(index === 5 ? 'data.json' : `tiento_post_${index}`);

    if (data.publicUrl === '' || !data.publicUrl) {
      throw new HttpException({
        code: HttpCodes.NOT_FOUND,
        message: 'resource not found',
      });
    }
    return data.publicUrl;
  }

  public async getDiscordNews(limit: number = 2): Promise<any[]> {
    const delimiter = limit <= 5 ? limit : 5;
    return Promise.allSettled([
      this.client.get(`/channels/${discordChannelsId.announcemets}/messages?limit=${delimiter}`),
      this.client.get(`/channels/${discordChannelsId.news}/messages?limit=${delimiter}`),
      this.client.get(`/channels/${discordChannelsId.updates}/messages?limit=${delimiter}`),
    ]);
  }
}
