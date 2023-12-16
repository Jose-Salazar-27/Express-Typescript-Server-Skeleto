import { inject, injectable } from "inversify";
import { ISocialMediaRepository } from "../dependency-injection";
import { TYPES } from "../shared/constants";
import { SocialMediaRepository } from "../repositories/social-media-repository";

@injectable()
export class SocialMediaService {
  private readonly repository: ISocialMediaRepository;

  constructor(
    @inject(TYPES.Social_Media.repository) readonly _repo: SocialMediaRepository
  ) {
    this.repository = _repo;
  }

  public getInstagramPhotos(): string[] {
    const urls = [];
    for (let index = 0; index < 5; index++) {
      const currentUrl = this.repository.getInstagramPhoto(index);
      urls[index] = currentUrl;
    }
    return urls;
  }
}
