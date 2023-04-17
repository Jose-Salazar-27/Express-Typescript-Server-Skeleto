const axios = require('axios');

async function fetchUserFromDiscord() {
  const testId = '969044990481281094';

  try {
    const result = await axios.get(`https://discord.com/api/v9/guilds/1086689618197483540/members/969044990481281094`, {
      headers: {
        Authorization: 'Bot MTA5NjIwMDA1Njg5NTQ0MzA1NA.GHsTVW.ZJakNfvLF-zTJNvJcG3h5XvRaWSZPFzGpxL6a4',
      },
    });

    const roles = result.data.roles;
    console.log(roles);

    return result;
  } catch (err) {
    console.log(err);
  }
}

fetchUserFromDiscord();
