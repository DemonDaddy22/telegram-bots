const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `Use the following commands

/start - start the bot
/help - help reference
/fortunecookie - get a random fortune cookie
/cat - get a random cat image
/cat <text> - get a random cat image with text written on it
`;

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('Welcome, to the Simple API Bot, ' + ctx.from.first_name + '! 👋\n');
    ctx.reply(helpMessage);
})

bot.help(ctx => {
    ctx.reply(helpMessage);
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

bot.command('cat', async ctx => {
    const input = ctx.message.text;
    const inputList = input.split(' ');

    if (inputList.length === 1) {
        try {
            const res = await axios.get('http://aws.random.cat/meow');
            bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
            bot.telegram.sendPhoto(ctx.chat.id, res.data.file, { reply_to_message_id: ctx.message.message_id })
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            inputList.shift();
            const text = inputList.join(' ');
            bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
            ctx.replyWithPhoto(`https://cataas.com/cat/says/${text}`);
        } catch (err) {
            console.log(err);
        }
    }
})

bot.launch()