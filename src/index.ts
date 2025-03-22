import 'dotenv/config';
import { Bot, session } from 'grammy';
import { aboutCommandHandler } from './handlers/about-handler';
import { startCommandHandler } from './handlers/start-handler';
import { aiChatHandler } from './handlers/ai-chat-handler';
import { containsBadWords } from './service/bad-word-check';

const bot = new Bot(process.env.BOT_TOKEN || '');

const warningMessages = [
  'Ой-ой! Похоже, ваш словарный запас немного вышел за рамки приличий! 😄',
  'Стоп! Ваши слова требуют цензуры! Давайте оставим их для вечеринки! 🎉',
  'Упс! Кажется, ваши слова решили немного пофлиртовать с цензурой! 😉',
  'Предупреждение! Ваши слова слишком горячие для этого чата! 🔥',
  'Эй, вы! Ваши слова пытаются сбежать из приличного общества! 😜',
];

export enum State {
  MAIN = 'Главная страница',
  START = 'Старт',
  ABOUT = 'Обо мне',
}

// Инициализация сессии
bot.use(
  //@ts-expect-error (remove it)
  session({
    initial: () => ({
      state: State.START,
    }),
  })
);

const COMMANDS = {
  start: startCommandHandler,
  about: aboutCommandHandler,
};

bot.command('start', COMMANDS.start);
bot.command('about', COMMANDS.about);

// Хранилище для количества предупреждений
const userWarnings = new Map<number, number>();

// Хранилище для заблокированных пользователей
const blockedUsers = new Map<number, number>();

// Функция для блокировки пользователя на 1 час
function blockUser(userId: number) {
  const blockDuration = 60 * 60 * 1000; // 1 час в миллисекундах
  blockedUsers.set(userId, Date.now() + blockDuration);

  // Удаляем пользователя из списка заблокированных через 1 час
  setTimeout(() => {
    blockedUsers.delete(userId);
    userWarnings.delete(userId); // Сбрасываем предупреждения после разблокировки
  }, blockDuration);
}

// Обработчик сообщений в чате
bot.on('message', async ctx => {
  const userId = ctx.from.id;

  // Проверяем, заблокирован ли пользователь
  if (blockedUsers.has(userId)) {
    const unblockTime = blockedUsers.get(userId);
    if (unblockTime && Date.now() < unblockTime) {
      await ctx.reply('Вы заблокированы на 1 час за использование нецензурной лексики.');
      return;
    }
  }

  const commentText = ctx.message.text;

  if (!commentText) {
    console.log('Комментарий не содержит текста.');
    return;
  }

  // Проверяем на наличие плохих слов
  if (containsBadWords(commentText)) {
    // Увеличиваем количество предупреждений для пользователя
    const warnings = (userWarnings.get(userId) || 0) + 1;
    userWarnings.set(userId, warnings);

    // Выбор случайного сообщения и добавление информации о количестве предупреждений
    const randomMessage =
      `${warningMessages[Math.floor(Math.random() * warningMessages.length)]}\n\n` +
      `Количество предупреждений: ${warnings}/10.`;

    // Отправка предупреждения
    await ctx.reply(randomMessage);
    await ctx.deleteMessage();

    // Если предупреждений 10, блокируем пользователя
    if (warnings >= 10) {
      blockUser(userId);
      await ctx.reply('Вы получили 10 предупреждений и заблокированы на 1 час.');
      return;
    }

    return; // Выходим из функции, чтобы не обрабатывать сообщение дальше
  }

  try {
    // Отправляем текст комментария на /generate
    const answer = await aiChatHandler(commentText);

    // Отправляем ответ на комментарий
    await ctx.reply(answer, {
      reply_to_message_id: ctx.message.message_id, // Ответить на конкретный комментарий
    });
  } catch (error) {
    console.error('Ошибка при обработке комментария:', error);
    await ctx.reply('Произошла ошибка при обработке вашего комментария.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

// Запуск бота
bot.start();
