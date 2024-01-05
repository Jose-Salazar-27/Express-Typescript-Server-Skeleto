import { discordChannelsId } from '../shared/constants/discord';

const hashMap: { [key: string]: string } = {
  [discordChannelsId.announcemets]: 'announcemets',
  [discordChannelsId.news]: 'news',
  [discordChannelsId.updates]: 'updates',
  //for demostration purpouses I will put some discord channels id
  // that will be replaced in the future
  [discordChannelsId.giveAway.academy]: 'academy channel',
  [discordChannelsId.giveAway.tryout]: 'tryout channel',
  [discordChannelsId.giveAway.first_team]: 'first team channel',
  [discordChannelsId.giveAway.legend]: 'channel legend',
};

export const getGuildName = (id: string): string => {
  return hashMap[id as keyof Object];
};
