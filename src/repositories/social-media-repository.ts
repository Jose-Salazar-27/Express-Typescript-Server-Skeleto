import { injectable } from "inversify";
import { ServerConfig } from "../config/server-config";
import { PublicUrlResponse } from "../models/supabase-response";
import { HttpCodes, HttpException } from "../exceptions/custom-error";
import { buckets } from "../shared/constants";

@injectable()
export class SocialMediaRepository extends ServerConfig {
  constructor() {
    super();
  }

  public getInstagramPhoto(index: number): string {
    const allowedindexes = [0, 1, 2, 3, 4];

    if (!allowedindexes.includes(index)) {
      throw new HttpException({
        code: HttpCodes.BAD_REQUEST,
        message: "invalid param",
      });
    }

    const { data }: PublicUrlResponse = this.supabaseClient.storage
      .from(buckets.images)
      .getPublicUrl(`tiento_post_${index}`);

    if (data.publicUrl === "" || !data.publicUrl) {
      throw new HttpException({
        code: HttpCodes.NOT_FOUND,
        message: "resource not found",
      });
    }
    return data.publicUrl;
  }
}
