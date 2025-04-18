#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printHelp, printSuccess, printError } from './services/log-service.js';
import { saveKeyValue, TOKEN_DICTIONARY } from './services/storage-service.js'
import { getWeather, getWeatherHTTPS } from './services/api-service.js'

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

const printWeather = async (city)  => {
	const data = await getWeather(city);
	console.log(data);
};

// Функция, которую будем вызывать в рамках запуска CLI
// Можно условно сказать, что в данной функции выполняется роутинг
// Для каждого роута (условия) есть своя изолированная функция-обработчик
const initCLI = () => {
	// process - глобальная переменная с информацией о процессе
	// process. просмотр доступных методов и переменных
	console.log(process.env);
	console.log(`-----------`);
	console.log(process.argv);
	const args = getArgs(process.argv)
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
	console.log("Weather:");
	// Обратиться к API для получения информации о погоде по городу
	// lon: 37.6156
	// lat: 55.7522
	getWeatherHTTPS('Moscow');
	// printWeather('London');
};

initCLI();
