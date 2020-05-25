const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    renderStartBody(ctx);
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