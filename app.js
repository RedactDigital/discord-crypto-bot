require('dotenv').config();
const Discord = require('./services/discord');

console.log(`${process.env.SYMBOL.toUpperCase()}_TOKEN`);
console.log(`${process.env.SYMBOL.toLocaleUpperCase()}_BOT_ID`);

// eslint-disable-next-line no-new
new Discord();
