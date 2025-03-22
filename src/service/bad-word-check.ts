import fs from 'fs';
import path from 'path';

// Загружаем список нецензурных слов из файла
const badWords = fs
  .readFileSync(path.join(__dirname, '../assets/ru_profane_words.txt'), 'utf-8')
  .split('\n')
  .map(word => word.trim());

// Функция для проверки текста на наличие нецензурных слов
export const containsBadWords = (text: string): boolean => {
  // Разбиваем текст на слова по пробелам и другим возможным разделителям
  const words = text.split(/\s+/); // \s+ соответствует одному или нескольким пробелам

  // Проверяем каждое слово
  return words.some(word => {
    // Приводим слово к нижнему регистру и проверяем его наличие в списке
    const lowerCaseWord = word.toLowerCase();
    return badWords.includes(lowerCaseWord);
  });
};