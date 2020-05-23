const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `Please choose from the following options

/start - start the bot
/newyork - get an image of New York City
/dubai - get a GIF of Dubai
/cities - get photos of 2 different cities
`;

const getRandomCities = cities => {
    let ind1 = Math.floor(Math.random() * cities.length), ind2 = Math.floor(Math.random() * cities.length);
    ind2 = ind2 === ind1 ? (ind2 + 1) % cities.length : ind2;
    return [cities[ind1], cities[ind2]];
}

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('Welcome to MediaBot, ' + ctx.from.first_name + '!\n');
    ctx.reply(helpMessage);
})

bot.help(ctx => {
    ctx.reply(helpMessage);
})

bot.command('test', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    // using url
    bot.telegram.sendPhoto(ctx.chat.id, 'https://images.unsplash.com/photo-1531887259712-aa6e090e9289?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80')

    // using file path
    bot.telegram.sendPhoto(ctx.chat.id, { source: 'res/london.jpg' });
})

bot.command('newyork', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    bot.telegram.sendPhoto(ctx.chat.id, { source: 'res/newyork.jpg' }, { reply_to_message_id: ctx.message.message_id });
})

bot.command('dubai', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    bot.telegram.sendAnimation(ctx.chat.id, 'https://media2.giphy.com/media/c0BdI069vyn5K/giphy.gif?cid=790b7611640372d3186cd2341995cb37839375a907f0a08e&rid=giphy.gif', { reply_to_message_id: ctx.message.message_id });
})

bot.command('cities', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    const cities = ['res/dubai.jpg', 'res/hongkong.jpg', 'res/london.jpg', 'res/newyork.jpg', 'res/singapore.jpg'];
    const randomCities = getRandomCities(cities);
    const result = randomCities.map(city => ({
        type: 'photo',
        media: { source: city }
    }));
    bot.telegram.sendMediaGroup(ctx.chat.id, result);
})

bot.launch();