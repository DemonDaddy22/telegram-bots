const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `
Here's a list of commands:

/start - start the bot
/help - help reference
/fact - get a random fact
/update - update the facts storage when google sheet is updated
`;

let dataStore = [];

getFactsData();

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('Welcome, to the Facts Bot ' + ctx.from.first_name + '! 🐻\n');
    ctx.reply(helpMessage);
})

bot.help(ctx => {
    ctx.reply(helpMessage);
})

bot.command('fact', ctx => {
    const maxRowCount = dataStore.filter(item => (
        item.row === '1' && item.col === '2'
    ))[0].val;

    const index = Math.floor(Math.random() * maxRowCount) + 1;

    const fact = dataStore.filter(item => (
        item.row == index && item.col === '4'
    ))[0].val;

    const message = `*Fact:* _${fact}_`;

    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    bot.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'markdown' });
})

bot.command('update', async ctx => {
    try {
        await getFactsData();
        ctx.reply('Update successful! ✌');
    } catch (err) {
        console.log(err);
        ctx.reply('Error occurred while performing update operation 🤖');
    }
})

bot.launch();

async function getFactsData() {
    try {
        const res = await axios.get(`https://spreadsheets.google.com/feeds/cells/${process.env.GOOGLE_SHEET_ID}/1/public/full?alt=json`);
        const data = res.data.feed.entry;
        dataStore = [];
        data.forEach(entry => {
            dataStore.push({
                row: entry.gs$cell.row,
                col: entry.gs$cell.col,
                val: entry.gs$cell.$t
            });
        });
    } catch (err) {
        console.log(err);
        throw new Error;
    }
}