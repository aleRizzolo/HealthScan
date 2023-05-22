const dotenv = require("dotenv")
const { Telegraf } = require("telegraf")

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
