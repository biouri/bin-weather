// Стандартная библиотека OS может использоваться для получения домашнего каталога
import { homedir } from 'os';

// join - объединение частей пути, учитывая особенности операционной системы
// basename - получение имени файла или вложения последней папки
// dirname - директория, где находится указанный путь
// extname - расширение файла

// Какой путь нам нужен относительно одного и второго
// relative - определение относительного пути между двумя путями
// isAbsolute - проверка на абсолютный путь
// resolve - разрешение абсолютного пути относительно текущего местоположения
// sep - получение системного разделителя путей (separator)
import { join, basename, dirname, extname, 
         relative, isAbsolute, resolve, sep } from 'path';

// join() использует особенности ОС при конкатенации
// join() умеет корректно обрабатывать переходы в каталоги '../weather-data.json'
const filePath = join(homedir(), 'weather-data.json');

// Универсальный метод сохранения "ключ: значение"
const saveKeyValue = (key, value) => {
    // Для разных ОС homedir() и др. будут отличаться
    // Пример для Windows: 
    // filePath: C:\Users\belok\weather-data.json
    // homedir(): C:\Users\belok
    // basename(): weather-data.json
    // dirname(): C:\Users\belok
    // extname(): .json
    // relative(): ..
    // isAbsolute(): true
    // resolve(): D:\Projects\node_abc
    // sep: \
    console.log(`filePath: ${filePath}`);
    console.log(`homedir(): ${homedir()}`);
    console.log(`basename(): ${basename(filePath)}`);
    console.log(`dirname(): ${dirname(filePath)}`);
    console.log(`extname(): ${extname(filePath)}`);
    console.log(`relative(): ${relative(filePath, dirname(filePath))}`);
    console.log(`isAbsolute(): ${isAbsolute(filePath)}`);
    console.log(`resolve(): ${resolve('..')}`);
    console.log(`sep: ${sep}`);

    // Код для сохранения данных ...
};

export { saveKeyValue };
