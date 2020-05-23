const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('Welcome, to the Simple API Bot, ' + ctx.from.first_name + '! 👋');
})

bot.command('fortunecookie', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    let fortune = 'Uh-oh! Seems like the luck is not on your side!';
    axios.get('http://yerkee.com/api/fortune')
        .then((res) => {
            fortune = res.data.fortune;
            ctx.reply(fortune);
        }).catch((err) => {
            console.log(err);
        });
})

bot.launch()