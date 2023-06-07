require('dotenv').config();
const Discord = require('./services/discord');

console.log(`${process.env.SYMBOL.toUpperCase()}_${process.env.TOKEN}`);
console.log(`${process.env.SYMBOL.toLocaleUpperCase()}_${process.env.BOT_ID}`);

// eslint-disable-next-line no-new
// new Discord();
