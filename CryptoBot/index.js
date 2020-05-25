const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const helpMessage = `
Refer the commands mentioned belowed:

/start - start the bot
/help - help reference
/info - see bot info

`;

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply(helpMessage);
    renderStartBody(ctx);
})

bot.help(ctx => {
    ctx.reply(helpMessage);
})

bot.action('start', ctx => {
    ctx.deleteMessage();
    ctx.answerCbQuery();
    renderStartBody(ctx);
})

bot.action('prices', ctx => {
    let message = `Get Price Information, Select one of the cryptocurrencies:`;
    ctx.deleteMessage();
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'BTC', callback_data: 'price-BTC' },
                    { text: 'ETH', callback_data: 'price-ETH' },
                ],
                [
                    { text: 'BCH', callback_data: 'price-BCH' },
                    { text: 'LTC', callback_data: 'price-LTC' },
                ],
                [
                    { text: 'Back to Menu', callback_data: 'start' }
                ]
            ]
        }
    })
})

const priceList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];
bot.action(priceList, async ctx => {
    const symbol = ctx.match.split('-')[1];
    try {
        const res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${process.env.CRYPTO_API_KEY}`);
        const data = res.data.DISPLAY[symbol].USD;
        let message = `
CryptoCurrency: *${symbol}*
Price: *${data.PRICE}*
Open: *${data.OPENDAY}*
High: *${data.HIGHDAY}*
Low: *${data.LOWDAY}*
Supply: *${data.SUPPLY}*
Market Cap: *${data.MKTCAP}*
        `;
        ctx.deleteMessage();
        ctx.answerCbQuery();
        bot.telegram.sendMessage(ctx.chat.id, message, {
            parse_mode: 'markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Back to Prices', callback_data: 'prices' }
                    ]
                ]
            }
        })
    } catch (err) {
        console.log(err);
    }
})

bot.command('info', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Bot Info', {
        reply_markup: {
            keyboard: [
                [
                    { text: 'Credits' },
                    { text: 'API' },
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
})

bot.hears('Credits', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('This Bot was created by @DemonDaddy22.');
})

bot.hears('API', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('This Bot uses CryptoCompare API.');
})

renderStartBody = ctx => {
    const message = 'Welcome to the Crypto Bot, ' + ctx.from.first_name + '! 😀';
    bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Crypto Prices', callback_data: 'prices' }
                ],
                [
                    { text: 'CoinMarketCap', url: 'https://coinmarketcap.com' }
                ]
            ]
        }
    })
}

bot.launch();