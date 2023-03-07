const { Bot, webhookCallback } = require("grammy");
const express = require("express");
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.on("message", async (ctx) => {
  const name = ctx.from.first_name;
  if (ctx.message.text === "/start") {
    await ctx.reply(`Hai ${name}, welcome to Scribd Unlock Bot. Silahkan kirimkan linknya.\nMade with ❤️ by @farhaneu`);
  } else {
    const regex = /^https:\/\/id\.scribd\.com\/document\/(\d{9})\/.*/ && /^https:\/\/id\.scribd\.com\/doc\/(\d{9})\/.*/;
    const match = ctx.message.text.match(regex);
    if (match) {
      const url = `https://id.scribd.com/embeds/${match[1]}/content/`;
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Link",
                url: url,
              },
            ],
          ],
        },
      };
      await ctx.reply("Ini URL yang anda minta:", options);
    } else {
      await ctx.reply("URL tidak valid, silahkan coba lagi");
    }
  }
});

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
