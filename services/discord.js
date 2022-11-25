const { Client, Intents } = require('discord.js');
const crypto = require('coingecko-api');
const Cron = require('cron').CronJob;

class Discord {
  constructor() {
    const intents = [[Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS]];
    this.discord = new Client({ intents });

    this.discord.on('ready', () => {
      log.info('Discord ready!');
      const guild = this.discord.guilds.cache.get(process.env.GUILD_ID);
      const bot = guild.members.cache.get(process.env.BOT_ID);

      this._onReady(bot);
    });

    this.discord.on('reconnecting', () => {
      log.info(`Reconnecting...`);
    });

    this.discord.on('disconnect', () => {
      log.info(`Disconnected`);
    });

    this.discord.on('error', error => {
      log.error(`Discord error: `, error);
    });

    this.discord.login(process.env.TOKEN);

    return this.discord;
  }

  async _onReady(bot) {
    try {
      const client = new crypto();
      // Get all coins from CoinGecko
      const coins = await client.coins.list();
      // Find the coin based on the symbol in env
      const coinId = coins.data.find(coin => coin.symbol == process.env.SYMBOL).id;

      const job = new Cron('* * * * *', async () => {
        try {
          // Get coin data
          const { data } = await client.coins
            .fetch(coinId, {
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            })
            .catch(e => {
              log.error('Error0: ', e);
            });

          if (!data) return;

          const price = data.market_data.current_price.usd.toFixed(5);
          const percentChange = data.market_data.price_change_percentage_24h.toFixed(4);

          // Update the bot's nickname
          bot.setNickname(`${process.env.SYMBOL.toUpperCase()} $${price}`);

          // Update the bot's activity
          bot.user.setActivity(`% 24H = ${percentChange}%`, { type: 'WATCHING' });

          log.info(`Updated price to ${price}`);
          log.info(`Updated % 24H to ${percentChange}%`);
        } catch (e) {
          log.error('Error1: ', e);
        }
      });

      await job.start();

      // Update the bot's avatar
      // Get coin data for the avatar (Discord only allows 2 updates every 10 min so this is outside the cronjob)
      const { data } = await client.coins
        .fetch(coinId, {
          tickers: false,
          market_data: false,
          community_data: false,
          developer_data: false,
          sparkline: false,
        })
        .catch(e => {
          log.error('Error2: ', e);
        });
      if (!data) return;
      await bot.user.setAvatar(data.image.large);
    } catch (error) {
      log.error('Error getting value: ', error);
    }
  }
}

module.exports = Discord;
