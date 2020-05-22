const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `
Here are a few commands which I offer

/start - Start the bot
/help - command reference
/echo - echo back the input message
`;

const activityLogger = ctx => {
    const date = new Date(ctx.message.date * 1000);
    console.log(ctx.from.first_name + ' typed (' + ctx.message.text + ') at time: ' + date);
}

bot.start(ctx => {
    activityLogger(ctx);
    ctx.reply('Welcome to the Echo Bot, ' + ctx.from.first_name + '😃\n').catch(err => console.log(err));
    ctx.reply(helpMessage).catch(err => console.log(err));
})

bot.help(ctx => {
    activityLogger(ctx);
    ctx.reply(helpMessage);
})

bot.command('echo', ctx => {
    activityLogger(ctx);
    const input = ctx.message.text;
    const inputList = input.split(' ');
    
    let message = '';
    if (inputList.length === 1) message = `I need some words to echo back 🌚`;
    else {
        inputList.shift();
        message = inputList.join(" ");
    }

    ctx.reply(message);
})

bot.on('message', ctx => {
    activityLogger(ctx);
    ctx.reply(`Uh-oh! That went over my head! 😕`);
})

bot.launch();