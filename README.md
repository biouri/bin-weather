# BIN-Weather

Description: CLI for getting weather

## Git

1. Инициализация репозитория Git в проекте.
2. Добавление изменений и выполнение первого коммита.
3. Переименование основной ветки в main.
4. Подключение внешнего репозитория origin.
5. Отправить во внешний репозиторий origin ветку main.

```bash
git init
git add .
git commit -m "Create NodeJS BIN-Weather Project with README.md + package.json"
git branch -M main
git remote add origin https://github.com/biouri/bin-weather.git
git push -u origin main
```

```bash
git commit -m "Configure package.json + Parsing command line arguments: args.js"
git commit -m "Add Log Service + Console Output + chalk + dedent-js"
git commit -m "Add OS + path + Example storage-service.js"
git commit -m "Add File system operations with async promises from fs"
git commit -m "Add API Service Example api-service.js"
git commit -m "Add Environment Variables process.env"
git commit -m "Add Error Handling in getForcast"
git commit -m "Add Global Installation + npm publish + npx + npm exec"
```

## Приложение BIN-Weather

1. Приложение на Node.js.

- Установка как глобальный npm-пакет.
- Общий вид приложения с параметрами запуска.

2. Функционал приложения

- Возможность запуска без параметров для получения погоды.

Команды для настройки:

- `Без параметров`: вывод текущей погоды.
- `--help`: информация и подсказки по командам.
- `-s <город>`: выбор и валидация города.
- `-t <токен>`: токен для API погоды.

3. Ключевые компоненты приложения

- Получение аргументов: обработка команд пользователя.
- Работа с файловой системой: сохранение настроек и токена.
- Интеграция с внешним API (`OpenWeather`) для получения данных о погоде.
- Стилизация вывода в консоль: визуальное оформление информации.
- Использование библиотеки OS из стандарта `Node.js`.

4. Интеграция с API `OpenWeather`

https://openweathermap.org/

- Бесплатный тариф: до 60 запросов в минуту и 1 миллион запросов в месяц.
- Возможности масштабирования приложения.

## Аргументы командной строки

Основной файл - `weather.js`.
Обновим `package.json` для указания точки входа и настройки бинарного вызова.

### Настройка `package.json`:

1. Указываем `main` файл: `weather.js` (как точка входа приложения).
2. Настроим бинарник:

- Название: `weather`.
- Файл: `weather.js`.

```json
...
  "main": "weather.js",
  "bin": {
    "weather": "weather.js"
  },
  "type": "module",
...
```

Такая настройка bin-секции означает, что при установке приложения глобально будет активна команда `weather` по которой запустится `weather.js` (в этом случае нужно добавить в начале файла `weather.js` строку `#! /usr/bin/env node`). Можно также указать `"weather": "node weather.js"`. Вместо `common.js` модулей будем использовать импорт ES6 модулей, для этого добавляем в конфигурацию: `"type": "module"`, без этой строки необходимо называть файлы-модули с расширением `*.mjs`.

### Конфигурация запуска файла:

Добавляем в начале файла `weather.js` строку `#! /usr/bin/env node` для указания окружения выполнения.

### Разработка `weather.js`:

1. Инициализация приложения
2. Вывод стартового сообщения в консоль.

```javascript
// Функция, которую будем вызывать в рамках запуска CLI
const initCLI = () => {
  // process - глобальная переменная с информацией о процессе
  // process. просмотр доступных методов и переменных
  console.log(process.argv);
  const args = getArgs(process.argv);
  console.log(args);
  // Вывести погоду
  console.log("Weather APP");
};

initCLI();
```

3. Разбор аргументов командной строки с использованием `process.argv`.

- Аргументы передаются в виде массива.
  Например, первый аргумент: чем выполняется, второй аргумент: точка входа.

```bash
node weather.js -h -s Moscow -t AB4434553450982340598
```

```text
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\Projects\\node_abc\\bin-weather\\weather.js',
  '-h',
  '-s',
  'Moscow',
  '-t',
  'AB4434553450982340598'
]
```

- Обработка и вывод дополнительных аргументов.

### Реализация разбора аргументов:

- Цель: упростить аргументы в объект для легкой работы.
- Создание хелпера в папке `helpers` для разбора аргументов (`args.js`).

```javascript
const getArgs = (args) => {
  const res = {};
  // Игнорировать первые два аргумента
  // Используется rest синтаксис для массивов
  // rest это массив без первых 2-х аргументов
  const [executer, file, ...rest] = args;
  rest.forEach((value, index, array) => {
    if (value.charAt(0) == "-") {
      if (index == array.length - 1) {
        // Это последний элемент, true = значит мы его нашли
        res[value.substring(1)] = true;
      } else if (array[index + 1].charAt(0) != "-") {
        // Значение элемента берем из следующего элемента
        res[value.substring(1)] = array[index + 1];
      } else {
        // Это элемент за которым есть параметр с дефисом -
        res[value.substring(1)] = true;
      }
    }
  });
  return res;
};

export { getArgs };
```

### Разбор аргументов командной строки:

1. Пропускаем первые два аргумента массива (исполняемый файл и файл скрипта).
2. Обрабатываем остальные аргументы:

- Определение ключей и значений.
- Обработка ключей с `-`.
- Присвоение `true` для одиночных флагов.

`weather.js`

```javascript
#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";

// Функция, которую будем вызывать в рамках запуска CLI
const initCLI = () => {
  // process - глобальная переменная с информацией о процессе
  // process. просмотр доступных методов и переменных
  console.log(process.argv);
  const args = getArgs(process.argv);
  console.log(args);
  if (args.h) {
    // Вывод help
  }
  if (args.s) {
    // Сохранить город
  }
  if (args.t) {
    // Сохранить токен
  }
  // Вывести погоду
  console.log("Weather APP");
};

initCLI();
```

### Итоги разбора:

```shell
node weather.js -h -s Moscow -t AB4434553450982340598
```

```text
{ h: true, s: 'Moscow', t: 'AB4434553450982340598' }
```

- Получаем объект с аргументами для удобной работы.
- Можно использовать для выполнения соответствующих команд в приложении (например, вывод помощи, сохранение города, токена).
- Была реализована простая система разбора аргументов CLI без использования сторонних библиотек.
- Для продвинутой работы с аргументами рекомендуется использовать готовые решения, например, библиотеку `yargs`.

## Вывод в консоль

## Создание log-сервиса

Цель: создать отдельный сервис для стилизованного вывода в консоль.

1. Создать папку `services`.
2. В папке создать файл `log-service.js`.

### Реализация методов вывода

Методы:

1. `printError(text)`: выводит сообщение об ошибке.
2. `printSuccess(message)`: выводит успешное сообщение.
3. `printHelp()`: выводит справку по командам.

### Использование библиотеки Chalk:

1. Установка: `npm install chalk`.
2. Позволяет стилизовать текст в консоли (цвета, фон).
3. Примеры: `bg-red` для ошибок, `bg-green` для успеха, `bg-cyan` для справки.

`package.json`

```
  "dependencies": {
    "axios": "^1.8.4",
    "chalk": "^5.4.1"
  }
```

### Проблемы и решения

1. `Common.js` vs `ES модули`: `Chalk v4.x` является библиотекой `Common.js`, в этом случае импорт должен быть выполнен соответствующим образом.
2. Отступы в многострочных строках: Для устранения нежелательных отступов используется библиотека `dedent-js`.

- Установка: `npm install dedent-js`.
- Применение: оборачивание строки функцией для удаления отступов.

`services\log-service.js`

```javascript
// До пятой версии библиотеки chalk использовался CommonJS импорт
// const chalk = require('chalk');
// ES6 импорт для chalk > v.5.0.0 (CommonJS больше не используется)
import chalk from "chalk";
import dedent from "dedent-js";

// Методы для вывода в консоль

// Вывод в консоль сообщения об ошибке
const printError = (error) => {
  console.log(chalk.bgRed(" ERROR ") + " " + error);
};

// Стандартный вывод сообщения
const printSuccess = (message) => {
  console.log(chalk.bgGreen(" SUCCESS ") + " " + message);
};

// Подсказка
const printHelp = () => {
  // Используется краткая запись передачи строки в фукнцию dedent()
  // dedent`...` можно применять чтобы убрать лишние отступы
  console.log(
    dedent`${chalk.bgCyan(" HELP ")}
		Без параметров - вывод погоды
		-s [CITY] для установки города
		-h для вывода помощи
		-t [API_KEY] для сохранения токена
		`
  );
};

export { printError, printSuccess, printHelp };
```

`bin-weather\weather.js`

```javascript
import { printHelp } from './services/log-service.js';
...
	if (args.h) {
		// Вывод help
		printHelp();
	}
```

Библиотека `Chalk v5.0.0` была официально выпущена 18 июня 2022 года.

### Основные изменения в Chalk 5:

- Полный отказ от CommonJS: `require('chalk')` больше не работает.
- Chalk 5 стал только ESM (ES Modules).
- Улучшения производительности и типизации (особенно для TypeScript).
- Чистый минимализм: удалено всё лишнее, упор только на ESM и core-функции.

✅ Поддержка `import`:
Используется современный синтаксис:

```javascript
import chalk from "chalk";
```

### Что делать, если используется CommonJS?

Необходимо использовать `Chalk v4.x`, например:

```bash
npm install chalk@4
```

Тогда можно использовать:

```js
const chalk = require("chalk");
console.log(chalk.green("CommonJS still works in v4!"));
```

✅ Правильный способ использовать `Chalk 5`:
Chalk использует цепочки стилей. Вместо прямых импортов нужно использовать методы объекта chalk.

```js
import chalk from "chalk";
console.log(chalk.bgCyan("Фон Cyan"));
```

❌ Неправильный способ использовать `Chalk 5`:

```js
// ❌ Неправильно: bgCyan не экспортируется как отдельный модуль
import chalk, { bgCyan } from "chalk";
```

Почему bgCyan нельзя импортировать в фигурных скобках?
Потому что Chalk не экспортирует bgCyan как отдельный элемент. Весь API Chalk реализован как один объект, экспортированный по умолчанию:

```javascript
// Псевдокод внутренностей chalk:
export default {
  bgCyan: function() { ... },
  red: function() { ... },
  bold: { ... },
  // и т.д.
}
```

Т.е. bgCyan — это свойство объекта, а не отдельный экспорт, поэтому возникает ошибка:

```javascript
SyntaxError: The requested module 'chalk' does not provide an export named 'bgCyan'
```

### Примеры использования `Chalk 5`

```javascript
import chalk from "chalk";

console.log(chalk.green("Зелёный текст"));
console.log(chalk.red.bold("Жирный красный"));
console.log(chalk.blue.italic("Синий курсив"));
console.log(chalk.bgYellow.black("Чёрный текст на жёлтом фоне"));

// 🟢 Цвета текста
chalk.red("Ошибка");
chalk.green("Успешно");
chalk.blue("Информация");
chalk.yellow("Предупреждение");
chalk.cyan("Лог");
chalk.white("Обычный текст");
chalk.gray("Заметка");

// 🎨 Цвета фона
chalk.bgRed("Фон красный");
chalk.bgGreen("Фон зелёный");
chalk.bgBlue("Фон синий");
chalk.bgYellow("Фон жёлтый");
chalk.bgCyan("Фон голубой");
chalk.bgWhite("Фон белый");

// 💅 Стили текста
chalk.bold("Жирный");
chalk.italic("Курсив");
chalk.underline("Подчёркнутый");
chalk.strikethrough("Зачёркнутый");

// 🔗 Комбинирование
console.log(chalk.bgGreen.black.bold(" Успешно "));
console.log(chalk.red.underline("Ошибка!"));
console.log(chalk.yellow.bold.italic("Внимание"));

// 🧠 Множественные строки
// Chalk можно применять к каждой строке отдельно:
console.log(`
${chalk.green("✓")} Всё готово!
${chalk.yellow("⚠")} Осторожно!
${chalk.red("✗")} Ошибка!
`);

// Chalk работает с ESM (import chalk from 'chalk')
// Chalk 5 не поддерживает require — только import
// Можно применять стили к переменным:
const success = chalk.green("Успешно");
console.log(success);
```

## OS и path

Подготовка сервиса для работы с хранилищем данных.
Обзор работы с библиотеками `Path` и `OS` в Node.js.

1. Выбор места хранения: Данные будем хранить в домашней директории пользователя в виде JSON-файла. Это позволяет избежать проблем с обновлением и запуском приложения из разных мест. Многие приложения размещают свои конфигурационные файлы в домашней директории пользователя.

2. Создание сервиса хранения: Создаем `storage-service.js` с методом `saveKeyValue` для универсального сохранения данных по ключу.

3. Использование библиотеки `OS`: Для работы с путями и директориями в разных операционных системах используем стандартную библиотеку `OS`, что упрощает получение домашней директории пользователя.

4. Применение библиотеки `Path`:

- `Join`: Объединение частей пути в один, учитывая особенности операционной системы.
- `BaseName`, `DirName`, `ExtName`: Получение имени файла, директории и расширения файла.
- `Relative`: Определение относительного пути между двумя путями.
- `isAbsolute`: Проверка на абсолютный путь.
- `Resolve`: Разрешение абсолютного пути относительно текущего местоположения.
- `sep`: Получение системного разделителя путей.

Подготовка `services\storage-service.js` и тестирование стандартных библиотек.

```javascript
// Стандартная библиотека OS может использоваться для получения домашнего каталога
import { homedir } from "os";

// join - объединение частей пути, учитывая особенности операционной системы
// basename - получение имени файла или вложения последней папки
// dirname - директория, где находится указанный путь
// extname - расширение файла

// Какой путь нам нужен относительно одного и второго
// relative - определение относительного пути между двумя путями
// isAbsolute - проверка на абсолютный путь
// resolve - разрешение абсолютного пути относительно текущего местоположения
// sep - получение системного разделителя путей (separator)
import {
  join,
  basename,
  dirname,
  extname,
  relative,
  isAbsolute,
  resolve,
  sep,
} from "path";

// join() использует особенности ОС при конкатенации
// join() умеет корректно обрабатывать переходы в каталоги '../weather-data.json'
const filePath = join(homedir(), "weather-data.json");

// Универсальный метод сохранения "ключ: значение"
const saveKeyValue = (key, value) => {
  // Тестирование функций из стандартных библиотек "os" и "path"
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
  console.log(`resolve(): ${resolve("..")}`);
  console.log(`sep: ${sep}`);

  // Код для сохранения данных ...
};

export { saveKeyValue };
```

## Работа с файловой системой

Разработка функции `saveKeyValue` для сохранения параметров (например, токен или город) с использованием файловой системы.

### Используемые инструменты

Модуль `fs` в Node.js для работы с файловой системой.

### Методы сохранения

1. `writeFileSync`: Блокирующий (синхронный) метод.
2. `writeFile`: Асинхронный метод на основе колбэков.
3. Предпочтительный метод: Использование `fs.promises` для работы с промисами, избегая `"callback hell"`.

### Реализация функции

- Создание базового объекта для хранения пар ключ-значение.
- Преобразование JavaScript объекта в строку JSON для сохранения файла с помощью `JSON.stringify`.
- Использование асинхронного метода `fs.promises.writeFile` для записи файла.
- Проверка существования файла перед записью, чтение и обновление содержимого если файл существует.

### Дополнительные функции

1. `exist`: Проверка наличия файла.
2. `getKey`: Извлечение значения по ключу из сохранённого файла.

### Обработка ошибок

1. Простая обработка ошибок с акцентом на верхнеуровневые обработчики.
2. Избежание включения логики вывода в консоль в сервис работы с файловой системой для разделения ответственности.

### Вспомогательные функции

Создание отдельных функций для сохранения токена и других параметров с обработкой ошибок и информированием пользователя о результате с помощью `printSuccess` и `printError`.

`services\storage-service.js`

```javascript
// Стандартная библиотека OS может использоваться для получения домашнего каталога
import { homedir } from "os";
import {
  join,
  basename,
  dirname,
  extname,
  relative,
  isAbsolute,
  resolve,
  sep,
} from "path";

// Чтение/Запись файлов (в данном случае используем promises)
// writeFileSync - синхронно записать данные в файл (используется редко)
// writeFile - асинхронная запись данных в файл
// promises - современный метод для получения информации об ОС, читать, записывать.
import { promises } from "fs";

// join() использует особенности ОС при конкатенации
const filePath = join(homedir(), "weather-data.json");

// Универсальный метод сохранения "ключ: значение"
// В этом методе нет обработки ошибок
const saveKeyValue = async (key, value) => {
  // Код для сохранения данных ...
  let data = {};
  // Проверить наличие файла и загрузить все данные (включая другие ключи)
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    data = JSON.parse(file);
  }
  // Добавить или модифицировать ключ
  data[key] = value;
  // Преобразование JavaScript объекта в строку JSON и сохранение
  // Если файл отсутствует, он будет создан
  await promises.writeFile(filePath, JSON.stringify(data));
};

const getKeyValue = async (key) => {
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    const data = JSON.parse(file);
    return data[key];
  }
  // Если нет данных, возвращаем undefined
  return undefined;
};

// Проверка наличия файла
const isExist = async (path) => {
  try {
    // stat(путь) возвращает статистику по файлу
    // если файла нет, то статистика отсутствует и возникает исключение
    await promises.stat(path);
    return true;
  } catch (e) {
    return false;
  }
};

export { saveKeyValue, getKeyValue };
```

`bin-weather\weather.js`

```javascript
#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { printHelp, printSuccess, printError } from "./services/log-service.js";
import { saveKeyValue } from "./services/storage-service.js";

// Обработка ошибок try-catch на уровне изолированной функции сохранения
const saveToken = async (token) => {
  try {
    await saveKeyValue("token", token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};

// Функция, которую будем вызывать в рамках запуска CLI
// Можно условно сказать, что в данной функции выполняется роутинг
// Для каждого роута (условия) есть своя изолированная функция-обработчик
const initCLI = () => {
  // process - глобальная переменная с информацией о процессе
  // process. просмотр доступных методов и переменных
  console.log(process.argv);
  const args = getArgs(process.argv);
  console.log(args);
  if (args.h) {
    // Вывод help
    printHelp();
  }
  if (args.s) {
    // Сохранить город
  }
  if (args.t) {
    // Сохранить токен
    // Вызов отдельной изолированной функции (с обработкой ошибок)
    return saveToken(args.t);
  }
  // Вывести погоду
  console.log("Weather APP");
};

initCLI();
```

## Взаимодействие с API

1. Получение API-ключа на сайте: `openweathermap.org`.
   Зарегистрируйтесь и подтвердите электронную почту.
   Получите ключ API в личном кабинете.

2. Лимиты и тарифы:
   60 запросов в минуту, 1 млн в месяц бесплатно.

3. Варианты использования API:
   Текущая погода, прогноз на 4 и 30 дней, массовые скачивания.

4. Создание запроса:
   Основные параметры: `Q` (город), `AppID` (ключ API), `Mode` (формат ответа, предпочтительно JSON), `Units` (единицы измерения, метрическая система), `Language` (язык ответа).

```javascript
// Пример URL для запроса в API
const url = await axios.get(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
);
```

5. Разработка сервиса для запросов:
   Создание функции `getWeather` для получения погоды по городу.
   Реализация через стандартную библиотеку HTTPS и использование Axios для упрощения запросов.

```javascript
import https from "https";
import { getKeyValue, TOKEN_DICTIONARY } from "./storage-service.js";

// Классический способ выполнения запроса при помощи https используется редко
const getWeatherHTTPS = async (city) => {
  // Хорошо бы обернуть весь код ниже в Promise и использовать resolve/reject
  // Но это все не очень удобно и сложно
  // return new Promise(...);

  // Ниже код, который желательно оборачивать в Promise
  const token = await getKeyValue(TOKEN_DICTIONARY.token);
  if (!token) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }

  // Формирование URL с добавлением параметров
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.append("q", city);
  url.searchParams.append("appid", token);
  url.searchParams.append("lang", "ru");
  url.searchParams.append("units", "metric");

  // Запрос и получение результата response
  https.get(url, (response) => {
    let res = "";
    // Подписаться на получение данных
    // Обычно кусочек получаемых данных называют chunk
    response.on("data", (chunk) => {
      res += chunk;
    });

    // Подписка на завершение
    // Вывести результат
    response.on("end", () => {
      console.log(`Ответ строка: ${res}`);
      // Парсим строку в объект
      // JSON.parse(jsonString) — превращает строку в объект.
      // JSON.stringify(..., null, 2) — превращает объект обратно в строку, но с отступами в 2 пробела.
      console.log(`JSON: ${JSON.stringify(JSON.parse(res), null, 2)}`);
    });

    // Аналогично можно подписаться на ошибки, на паузу, на закрытие канала
    response.on("error", (error) => {
      // Обработка ошибки
      console.log(`Error: ${error}`);
      return;
    });
  });
};

export { getWeatherHTTPS };
```

6. Ошибки и проверки:
   Добавление проверки на наличие токена.
   Обработка ошибок запроса и отсутствия ключа API.

7. Рефакторинг и улучшения:
   Переход на более простой и безопасный способ построения URL.
   Использование `Axios` для более удобной работы с HTTP-запросами.

```javascript
import axios from "axios";

const getWeather = async (city) => {
  const token = await getKeyValue(TOKEN_DICTIONARY.token);
  if (!token) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }
  // В Axios удобный способ конструирования запроса с дополнительной опцией params
  // В ответе содержатся данные data и др. информация: headers, response ...
  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: city,
        appid: token,
        lang: "ru",
        units: "metric",
      },
    }
  );
  return data;
};

export { getWeather };
```

8. Практическое использование сервиса:
   Пример запроса погоды для города (Москва).
   Анализ полученных данных и обработка результатов.

`bin-weather\weather.js`

```javascript
import { saveKeyValue, TOKEN_DICTIONARY } from "./services/storage-service.js";
import { getWeather, getWeatherHTTPS } from "./services/api-service.js";

// Обработка ошибок try-catch на уровне изолированной функции сохранения
const saveToken = async (token) => {
  if (!token.length) {
    printError("Не передан token");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};

// Если используется асинхронная функция getWeather возвращающая данные
const printWeather = async (city) => {
  const data = await getWeather(city);
  console.log(data);
};

// Вывести погоду
console.log("Weather:");
// Обратиться к API для получения информации о погоде по городу
getWeatherHTTPS("Moscow");
// printWeather('London');
```

```bash
node weather.js -t 0123456789abcd...
node weather.js
```

## Переменные окружения

Переменные окружения оказываются полезным инструментом для настройки и тестирования приложений, позволяя легко модифицировать параметры без изменения кода.

### Что такое переменные окружения:

- Переменные окружения являются глобальными настройками для операционной системы или отдельного приложения.
- Используются для настройки различных параметров окружения, например, указания того, что приложение запущено в `development` окружении вместо `production`.

### Хранение токенов:

Обычно токены и подобные данные хранятся в JSON файлах, но для глобального доступа удобнее использовать переменные окружения.

### Как работать с переменными окружения в Node.js:

- Для отображения текущих переменных окружения используется `console.log(process.env);`.
- `process.env` позволяет получить доступ к переменным окружения вашей операционной системы.

### Добавление переменных окружения:

1. Временное добавление происходит через командную строку перед запуском приложения, например, `test=1 node weather.js`. Такая команда используется в Linux и Unix подобных ОС.

2. В Windows необходимо использовать: `set "TEST=1" && node weather.js`. Кавычки гарантируют, что значение будет установлено ровно как нужно, без пробелов.

3. Через .env файл (универсальный способ)

Создать файл .env:

```text
TEST=1
```

И использовать библиотеку вроде dotenv в Node.js:

```javascript
require("dotenv").config();

console.log(process.env.TEST); // '1'
```

4. Аналогично, для постоянного добавления переменных окружения используется конфигурация Shell или Bash.

### Пример использования:

1. Передача отладочного токена через переменную окружения для использования в API запросах.
2. Покрытие случаев, когда переменная окружения может быть или не быть установлена, и выбор фолбэка для токена.

```javascript
// Если задана переменная окружения TOKEN, иначе из файла-настроек
const token = process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));
```

Пример использования в Windows:

```shell
set "TOKEN=04350c0ABCDa4cd3456da7124aeABC28" && node weather.js
```

## Обработка ошибок

1. Типы ошибок:

- Ошибка 401: Неправильно указан токен.
- Ошибка 404: Неправильно указан город.

2. Проверка ошибок:
   Можно запустить запрос с неверным городом или без токена для получения ошибки 404 или 401 соответственно.

3. Создание метода `getForecast`:

- `getForecast` является частью `getWeather`.
- Позволяет вызывать погоду для заданного города.
- Требует добавления `async` для работы с асинхронными запросами.

4. Обработка ошибок:

- Использование `catch` для перехвата ошибок.
- Проверка типа ошибки через статус код.
- Вывод сообщения в зависимости от типа ошибки.
- 404: Неверно указан город.
- 401: Неверно указан токен.
- Прочие ошибки: Вывод стандартного сообщения об ошибке.

```javascript
const getForcast = async () => {
  try {
    // Город читаем из переменной окружения CITY
    const weather = await getWeather(process.env.CITY);
    console.log(weather); // Красивый вывод погоды (необходимо реализовать)
  } catch (e) {
    // Ошибка Axios может содержать status код
    if (e?.response?.status == 404) {
      printError("Неверно указан город");
    } else if (e?.response?.status == 401) {
      printError("Неверно указан токен");
    } else {
      // Любая другая ошибка
      printError(e.message);
    }
  }
};

const initCLI = () => {
...
	// Обратиться к API для получения информации о погоде по городу
	getForcast();
}

initCLI();
```

Задать дополнительно переменную CITY

```shell
set "TOKEN=04350c0b914a4cd01967da724ae05828" && set "CITY=London" && node weather.js
```

Возможны ошибки:

- первые две: Axios дополнительно обработаны;
- третья: Любая другая ошибка.

```Bash
 ERROR  Неверно указан токен
 ERROR  Неверно указан город
 ERROR  Request failed with status code 400
```

### 💡 Альтернатива (все переменные CMD в одной строке, как в Linux):

В cmd.exe нет прямого аналога `VAR=value VAR2=value2 node app.js`, но можно использовать `cmd /C` с объединением:

```cmd
cmd /C "set TOKEN=04350c0b914a4cd01967da724ae05828 && set CITY=London && node weather.js"
```

Но обычно первый способ с несколькими set и && — проще и понятнее.

### Как удалить временные переменные (в рамках текущей сессии cmd)

Если установлены переменные с помощью set, то можно удалить их так:

```cmd
set CITY=
set TOKEN=
```

## Упражнение - Завершение приложения

Реализовать вывод текущей погоды и функционал сохранения выбранного города.

Шаги Реализации:

1. Добавить Сохранение Города:

- Используйте аналогию сохранения токена для реализации сохранения города.
- Добавьте проверку корректности введённого города через запрос к API. Если погода возвращается, город сохраняется.

2. Красивый Вывод Погоды:

- Элементы оформления (иконки, эмоджи, цвета) остаются на ваш выбор.
- Реализуйте функционал красиво отформатированного вывода данных о погоде.

### Реализация:

1. Создаем метод `saveCity` для сохранения города.

`weather.js`

```javascript
const saveCity = async (city) => {
  if (!city.length) {
    printError("Не передан город");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess("Город сохранён");
  } catch (e) {
    printError(e.message);
  }
};
```

2. Реализуем метод `printWeather` для вывода информации о погоде:

- Используем эмоджи для визуализации погодных условий.
- Выводим температуру, влажность, скорость ветра и другие параметры.

`services\api-service.js`

```javascript
const getIcon = (icon) => {
  switch (icon.slice(0, -1)) {
    case "01":
      return "☀️";
    case "02":
      return "🌤️";
    case "03":
      return "☁️";
    case "04":
      return "☁️";
    case "09":
      return "🌧️";
    case "10":
      return "🌦️";
    case "11":
      return "🌩️";
    case "13":
      return "❄️";
    case "50":
      return "🌫️";
  }
};
```

`services\log-service.js`

```javascript
const printWeather = (res, icon) => {
  console.log(
    dedent`${chalk.bgYellow(" WEATHER ")} Погода в городе ${res.name}
		${icon}  ${res.weather[0].description}
		Температура: ${res.main.temp} (ощущается как ${res.main.feels_like})
		Влажность: ${res.main.humidity}%
		Скорость ветра: ${res.wind.speed}
		`
  );
};
```

3. Интегрируем проверку и сохранение города, а также получение и вывод погоды в клиентскую часть приложения.

```javascript
const getForcast = async () => {
  try {
    // Город читаем из переменной окружения CITY
    // Если задана переменная окружения CITY, иначе из файла-настроек
    const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city));
    const weather = await getWeather(city);
    // Красивый вывод погоды
    printWeather(weather, getIcon(weather.weather[0].icon));
  } catch (e) {
    // Ошибка Axios может содержать status код
    if (e?.response?.status == 404) {
      printError("Неверно указан город");
    } else if (e?.response?.status == 401) {
      printError("Неверно указан токен");
    } else {
      // Любая другая ошибка
      printError(e.message);
    }
  }
};

// Функция, которую будем вызывать в рамках запуска CLI
// Можно условно сказать, что в данной функции выполняется роутинг
// Для каждого роута (условия) есть своя изолированная функция-обработчик
const initCLI = () => {
  // process - глобальная переменная с информацией о процессе
  const args = getArgs(process.argv);
  if (args.h) {
    // Вывод help
    return printHelp();
  }
  if (args.s) {
    // Сохранить город
    // Вызов отдельной изолированной функции (с обработкой ошибок)
    return saveCity(args.s);
  }
  if (args.t) {
    // Сохранить токен
    // Вызов отдельной изолированной функции (с обработкой ошибок)
    return saveToken(args.t);
  }
  // Вывести погоду
  // Обратиться к API для получения информации о погоде по городу
  return getForcast();
};

initCLI();
```

## Публикация пакета в NPM

Публикация CLI для глобального использования.

### Шаг 1: Подготовка

Проверка Авторизации: Используем `npm whoami` для проверки того, под каким пользователем мы залогинены в NPM.
Имя Пакета: Изменяем имя пакета (пример на `bin-weather`), так как оригинальное имя уже может быть занято.

### Шаг 2: Конфигурация пакета

Внесение Изменений: Меняем название пакета и, при необходимости, другие поля в файле `package.json` вроде `home-page`, `repository`.
Точка Входа: Настраиваем точку входа через определение команды и файла выполнения (`weather.js`).

### Шаг 3: Публикация

NPM Publish: Применяем команду `npm publish` для публикации пакета в NPM.
Игнорирование файлов: Убедитесь, что в файле `.npmignore` указаны все ненужные для публикации файлы или папки, например, `node_modules`.

```shell
npm publish
```

Исправление ошибок в файле конфигураций `package.json` согласно рекомендациям:

```shell
npm pkg fix
```

Вариант лога после первоначальной публикации `npm publish` до исправления ошибок конфигурации, для повторной публикации потребуется изменить версию:

```text
npm warn publish npm auto-corrected some errors in your package.json when publishing.  Please run "npm pkg fix" to address these errors.
npm warn publish errors corrected:
npm warn publish "repository.url" was normalized to "git+https://github.com/biouri/bin-weather.git"
npm notice
npm notice 📦  bin-weather@1.0.0
npm notice Tarball Contents
npm notice 48.9kB README.md
npm notice 955B helpers/args.js
npm notice 776B package.json
npm notice 3.9kB services/api-service.js
npm notice 1.7kB services/log-service.js
npm notice 3.8kB services/storage-service.js
npm notice 3.3kB weather.js
npm notice Tarball Details
npm notice name: bin-weather
npm notice version: 1.0.0
npm notice filename: bin-weather-1.0.0.tgz
npm notice package size: 16.2 kB
npm notice unpacked size: 63.3 kB
npm notice shasum: 95f24a590ddaee4c3085b4728f680da586c23383
npm notice integrity: sha512-Pmi/Y6KuqS188[...]PP/0zjcwCkepw==
npm notice total files: 7
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and default access
+ bin-weather@1.0.0
```

### Шаг 4: Дополнительные настройки

Скрипты Сборки: Если необходимо, можно настроить автоматическую сборку перед публикацией через `package.json`, используя поля вроде `pre-publish` (старый способ) и `prepare` (новый способ). Например, необходима предварительная сборка (или минификация) перед публикацией при помощи `tsc`:

`package.json`

```javascript
  "scripts": {
    "prepare": "tsc",
    ...
  },
```

### Шаг 5: Глобальная установка и тестирование

Установка: Устанавливаем пакет глобально с помощью `npm install -g bin-weather`.
Тестирование функциональности: Проверяем работу утилиты через выполнение команды `weather`.

```shell
npm install -g bin-weather
weather
```

Например, после глобальной установки пакет будет находиться в каталоге:
`C:\Program Files\nodejs\node_modules\bin-weather`
В каталоге `C:\Program Files\nodejs` будут расположены файлы скриптов для запуска.

```text
weather
weather.cmd
weather.ps1
```

В этом каталоге также находятся `node.exe` и другие глобальные скрипты: `npm`, `npm-check`, `npx`, `rollup`, `live-server` и др.

## Npx и npm exec

1. npm и npx:

- `npm` является пакетным менеджером, который позволяет устанавливать зависимости для проекта.
- `npx` включен в npm с версии 5.2.0, предоставляет возможность запускать пакеты не устанавливая их глобально.

2. Передача аргументов в npm-команды:
   При использовании команды `npm start` для запуска скрипта, аргументы передаются через двойные черты (`--`).

`package.json`

```javascript
  "scripts": {
    "start": "node weather.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Пример: если необходимо передать параметр `-s moscow` в скрипт `weather.js`, команда будет выглядеть так: `npm start -- -s moscow`.
Двойные черты говорят npm передать следующие за ними аргументы непосредственно запускаемому скрипту, а не обрабатывать их как параметры самого `npm`.

3. Использование `npx` для исполнения пакетов:
   `npx` позволяет временно скачать и запустить пакет без его установки в систему.
   Пример: удаление установленного пакета `bin-weather` и последующий его запуск через `npx` (`npx bin-weather`). Запуск возможен без предварительной установки пакета, `npx` загрузит и исполнит его из кэша.

```shell
npx bin-weather
```

4. Введение в `npm exec` (альтернатива `npx`):
   С последних версий `npm`, `npx` получил альтернативу в виде команды `npm exec`.
   `npm exec` работает аналогично `npx` - позволяет исполнять пакеты, временно загружая их в кэш.
   Также требуется использование двойных черт для передачи аргументов непосредственно в исполняемый пакет.

```shell
npm exec bin-weather
npm exec bin-weather -- -s Bratislava
```
