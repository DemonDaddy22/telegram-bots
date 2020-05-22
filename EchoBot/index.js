const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `
Here are a few commands which I offer

/start - Start the bot
/help - command reference
/echo <message> - echo back the input message
`;

bot.use((ctx, next) => {
    const date = new Date(ctx.message.date * 1000);
    if (ctx.updateSubTypes[0] === 'text') bot.telegram.sendMessage(process.env.CHAT_ID, ctx.from.first_name + ' typed (' + ctx.message.text + ') at time: ' + date);
    else bot.telegram.sendMessage(process.env.CHAT_ID, ctx.from.first_name + ' sent ' + ctx.updateSubTypes[0] + ' at time: ' + date);
    next();
})

bot.start(ctx => {
    ctx.reply('Welcome to the Echo Bot, ' + ctx.from.first_name + '😃\n').catch(err => console.log(err));
    ctx.reply(helpMessage).catch(err => console.log(err));
})

bot.help(ctx => {
    ctx.reply(helpMessage);
})

bot.command('echo', ctx => {
    const input = ctx.message.text;
    const inputList = input.split(' ');
    
    let message = '';
    // inputList - ['/echo']
    if (inputList.length === 1) message = `I need some words to echo back 🌚`;
    else {
        inputList.shift();
        message = inputList.join(" ");
    }

    ctx.reply(message);
})

bot.on('message', ctx => {
    ctx.reply(`Uh-oh! That went over my head! 😕`);
})

bot.launch();