import { Keyboard } from 'grammy';

export const mainKeyboard = new Keyboard()
  .text('Главная страница')
  .row() // Добавляем новую строку
  .text('Доступные команды')
  .row() // Добавляем новую строку
  .text('Обо мне')
  .resized(); // Устанавливаем клавиатуру внизу