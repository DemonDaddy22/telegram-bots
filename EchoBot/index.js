const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
    ctx.reply('Welcome ' + ctx.from.first_name + ', to the Echo Bot 😃');
})

bot.launch();