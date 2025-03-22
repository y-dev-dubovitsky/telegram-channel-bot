import { Context } from 'grammy';

export const aboutCommandHandler = async (ctx: Context) => {
  const botInfo = {
    name: '@HeartLionBot',
    description:
      'Привет! Я Heart ❤️ Lion — ваш многофункциональный помощник. Я умею поддерживать беседу на различные темы и могу переводить текст на разные языки. Просто напишите мне, и я с радостью отвечу вам и помогу с переводом, если это необходимо. Давайте общаться и учиться вместе',
    author: 'y.dev.dubovitsky@gmail.com',
    github: 'https://github.com/ydubovitsky',
    email: 'y.dev.dubovitsky@gmail.com', // Убираем экранирование для HTML
  };

  const infoMessage = `
<b>Информация о боте:</b>
  
<b>Название:</b> ${botInfo.name}
<b>Описание:</b> ${botInfo.description}
<b>Автор:</b> ${botInfo.author}
<b>Почта для сотрудничества:</b> ${botInfo.email}
<b>Github:</b> ${botInfo.github}

  `.trim(); // Удаляем лишние пробелы и переносы

  await ctx.reply(infoMessage, { parse_mode: 'HTML' }); // Используем HTML для разметки
};
