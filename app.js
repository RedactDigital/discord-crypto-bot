require('dotenv').config();
const Discord = require('./services/discord');

const botIdEnv = `${process.env.SYMBOL.toUpperCase()}_BOT_ID`;
const tokenEnv = `${process.env.SYMBOL.toUpperCase()}_BOT_TOKEN`;

console.log(process.env[botIdEnv]);
console.log(process.env[tokenEnv]);

console.log(botIdEnv);
console.log(tokenEnv);

// eslint-disable-next-line no-new
// new Discord();
