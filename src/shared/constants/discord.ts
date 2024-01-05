export const discordChannelsId = Object.freeze({
  announcemets: '1009436850718507109',
  news: '1009436869680971887',
  updates: '1009436888534368397',

  tryout: '', //channel -> not defined yet
  firstTeam: '', //channel -> not defined yet
  academy: '', //channel -> not defined yet
  legend: '', //channel -> not defined yet

  giveAway: {
    tryout: '1009437570146517123', //channel general giveaways
    academy: '1009437642720550922',
    first_team: '1009437701797326878',
    legend: '1009437762308538438',
  },
});

export const discordRolesId = Object.freeze({
  tryout: '1009431608715137054',
  academy: '1009431608127914095',
  first_team: '1009431607167426612',
  legend: '1009431606987083846',
});

export const roleTable = {
  [discordChannelsId.giveAway.tryout]: 1,
  [discordChannelsId.giveAway.academy]: 2,
  [discordChannelsId.giveAway.first_team]: 3,
  [discordChannelsId.giveAway.legend]: 4,
};

export const levelTable = {
  [discordRolesId.tryout]: 1,
  [discordRolesId.academy]: 2,
  [discordRolesId.first_team]: 3,
  [discordRolesId.legend]: 4,
};

export const guildId = '1009430885117992980';
