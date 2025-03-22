import * as path from 'path';
import { InputFile, Context } from 'grammy';
import { startInlineKeyboard } from '../ui';

export const startCommandHandler = async (ctx: Context) => {
  await ctx.reply(
    'Привет, давайте знакомиться. Я ваш помошник и собеседник - NotReadySirBot'
  );

  // const imagePath = path.join(process.cwd(), 'assets', 'OxNJezp5xoED.png');

  // Отправка фотографии
  // await ctx.replyWithPhoto(new InputFile(imagePath));

  // await ctx.reply(
  //   'Вы можете выбрать что-то из пункта меню или давайте просто поболтаем',
  //   {
  //     reply_markup: startInlineKeyboard, // Возвращаем встроенную клавиатуру
  //   }
  // );
};
