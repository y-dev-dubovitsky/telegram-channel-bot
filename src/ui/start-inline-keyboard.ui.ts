import { InlineKeyboard } from 'grammy';
import { State } from '..';

// Создаем встроенную клавиатуру с кнопками
export const startInlineKeyboard = new InlineKeyboard()
  .text('О создателе', State.ABOUT)
  .text('Главная', State.MAIN)
  .row()
  .text('Начать', State.START);
