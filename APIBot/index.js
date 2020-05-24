const Telegraf = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `Use the following commands

/start - start the bot
/help - help reference
/fortunecookie - get a random fortune cookie
/cat - get a random cat image
/cat <text> - get a random cat image with text written on it
/dogbreeds - returns a list of dog breeds
/dog <breed> - get a random image of input dog breed
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

bot.command('dogbreeds', ctx => {
    const rawData = fs.readFileSync('./dogBreeds.json', 'utf8');
    const data = JSON.parse(rawData);

    let message = `Here's a list of *Dog Breeds*:\n\n`;
    data.forEach(dog => {
        message += `\t-_${dog}_\n`;
    })

    ctx.reply(message, { parse_mode: 'markdown' });
})

bot.command('dog', ctx => {
    const inputList = ctx.message.text.split(' ');
    if (inputList.length !== 2) {
        ctx.reply('Please enter a *dog breed*', { parse_mode: 'markdown' });
        return;
    }
    const breedInput = inputList[1];
    const rawData = fs.readFileSync('./dogBreeds.json', 'utf8');
    const data = JSON.parse(rawData);

    if (data.includes(breedInput)) {
        axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
            .then(res => {
                bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
                bot.telegram.sendPhoto(ctx.chat.id, res.data.message, { reply_to_message_id: ctx.message.message_id });
            })
            .catch(err => console.log(err))
    } else {
        const suggestions = data.filter(item => item.startsWith(breedInput));

        let message = `Did you mean?\n\n`;
        suggestions.forEach(dog => {
            message += `\t-_${dog}_\n`;
        })

        if (suggestions.length === 0) message = `Sorry! Couldn't find that breed 🙁`;

        ctx.reply(message, { parse_mode: 'markdown' });
    }
})

bot.launch()