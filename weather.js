#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log-service.js';
import { saveKeyValue, getKeyValue, TOKEN_DICTIONARY } from './services/storage-service.js'
import { getWeather, getIcon } from './services/api-service.js'

// Обработка ошибок try-catch на уровне изолированной функции сохранения
const saveToken = async (token) => {
	if (!token.length) {
		printError('Не передан token');
		return;
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.token, token);
		printSuccess('Токен сохранён');
	} catch (e) {
		printError(e.message);
	}
}

const saveCity = async (city) => {
	if (!city.length) {
		printError('Не передан город');
		return;
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.city, city);
		printSuccess('Город сохранён');
	} catch (e) {
		printError(e.message);
	}
}

const getForcast = async () => {
	try {
		// Город читаем из переменной окружения CITY
		// Если задана переменная окружения CITY, иначе из файла-настроек
		const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
		const weather = await getWeather(city);
		// Красивый вывод погоды
		printWeather(weather, getIcon(weather.weather[0].icon));
	} catch (e) {
		// Ошибка Axios может содержать status код
		if (e?.response?.status == 404) {
			printError('Неверно указан город');
		} else if (e?.response?.status == 401) {
			printError('Неверно указан токен');
		} else {
			// Любая другая ошибка
			printError(e.message);
		}
	}
}

// Функция, которую будем вызывать в рамках запуска CLI
// Можно условно сказать, что в данной функции выполняется роутинг
// Для каждого роута (условия) есть своя изолированная функция-обработчик
const initCLI = () => {
	// process - глобальная переменная с информацией о процессе
	// process. просмотр доступных методов и переменных
	// console.log(`--- process.env ---`);
	// console.log(process.env);
	// console.log(`--- process.argv ---`);
	// console.log(process.argv);
	const args = getArgs(process.argv);
	// console.log(args);
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
