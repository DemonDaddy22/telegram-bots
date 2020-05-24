const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    ctx.reply('Welcome to the Crypto Bot, ' + ctx.from.first_name + '! 😀');
})

bot.command('menu', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Main Menu', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'See fruits list', callback_data: 'fruits' },
                    { text: 'See meats list', callback_data: 'meats' }
                ]
            ]
        }
    });
})

bot.action('fruits', ctx => {
    ctx.deleteMessage();
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, 'List of fruits:\n\t-Apples\n\t-Oranges\n\t-Mangoes', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Menu', callback_data: 'menu' }
                ]
            ]
        }
    });
})

bot.action('meats', ctx => {
    ctx.deleteMessage();
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, 'List of meats:\n\t-Chicken\n\t-Fish\n\t-Pork', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Menu', callback_data: 'menu' }
                ]
            ]
        }
    });
})


bot.action('menu', ctx => {
    ctx.deleteMessage();
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, 'Main Menu', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'See fruits list', callback_data: 'fruits' },
                    { text: 'See meats list', callback_data: 'meats' }
                ]
            ]
        }
    });
})
// bot.action('one', ctx => {
//     ctx.answerCbQuery();
//     ctx.reply(ctx.from.first_name + ' you clicked button one.');
// })

bot.launch();