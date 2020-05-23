const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
    ctx.reply('Welcome, to the Simple API Bot, ' + ctx.from.first_name + '! 👋');
})

bot.launch()