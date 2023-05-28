const dotenv = require("dotenv")
const { Telegraf } = require("telegraf")

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "hello there! Welcome to my new telegram bot.", {})
  bot.telegram.sendMessage(ctx.chat.id, "Select an option", getFunctions)
})

bot.command("help", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Select an option", getFunctions)
})

bot.hears("average", (ctx, next) => {})

const getFunctions = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "Average",
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
}

bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
