const Telegraf = require('telegraf');

// Store your Bot Token as an environment variable to disable others from accessing it
const bot = new Telegraf(process.env.BOT_TOKEN);

// ------------ BASIC HANDLERS ------------

// /start - handler to start the bot
// start function takes an argument as function (called middleware) which further requires 2 arguments - context object and next function (optional)
bot.start((ctx, next) => {
    const quote = `Your limitation—it's only your imagination.`;
    ctx.reply('Welcome ' + ctx.from.first_name + ', hope you are doing great!');
    // alternately
    // bot.telegram.sendMessage(ctx.chat.id, 'Welcome ' + ctx.from.first_name + ', hope you are doing great!', { parse_mode: 'Markdown' });
    ctx.state.quote = quote;
    next(ctx); // next will basically trigger the next possible middleware (in this case, use will be triggered)
})

// /help - handler to invoke a help menu
bot.help(ctx => {
    ctx.reply('You entered the Help command!');
})

// /settings - handler to invoke settings
bot.settings(ctx => {
    ctx.reply('You entered the Setting command!');
})

// ------------ CUSTOM HANDLERS ------------

// command function takes 2 arguments, first being the name(s) of handler(s)(string or list of strings) and second is the middleware function
bot.command(['test', 'Test', 'TEST'], ctx => {
    ctx.reply('Hi ' + ctx.from.first_name + '! This is a test command!');
})

// hears method does not require a command (i.e. something followed by forward slash), and is triggered for specific text
// it takes 2 arguments, first is the text(s) (string, list of strings, regex) and second is the middleware
bot.hears('dog', ctx => {
    ctx.reply('Bhow Bhow!');
})

// on method triggers middleware for an update type (list of update types can be found here - https://telegraf.js.org/#/?id=telegraf)
bot.on('location', ctx => {
    ctx.reply('Your current location is: Latitude - ' + ctx.message.location.latitude + ' and Longitude - ' + ctx.message.location.longitude);
})

// for handling username mentions (eg. @botfather) - gets triggered even if username is present in a long piece of text
bot.mention('botfather', ctx => {
    ctx.reply(ctx.from.first_name + ', you mentioned @botfather in your message.');
})

// for handling phone numbers
bot.phone(process.env.PHONE_NO, ctx => {
    ctx.reply(ctx.from.first_name + ' you entered ' + process.env.PHONE_NO);
})

// for handling hashtags - #awesome
bot.hashtag('awesome', ctx => {
    ctx.reply(ctx.from.first_name + ' you are totally Awesome!');
})

// use method is called whenever you interact with the bot (except the cases where you have already defined some handler or action)
bot.use(ctx => {
    ctx.reply(ctx.from.first_name + `, here's a motivation quote for you: ` + ctx.state.quote);
})

// launch function is used to launch the bot
bot.launch();