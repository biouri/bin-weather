#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printHelp, printSuccess, printError } from './services/log-service.js';
import { saveKeyValue } from './services/storage-service.js'

// Обработка ошибок try-catch на уровне изолированной функции сохранения
const saveToken = async (token) => {
	try {
		await saveKeyValue('token', token);
		printSuccess('Токен сохранён');
	} catch (e) {
		printError(e.message);
	}
}

// Функция, которую будем вызывать в рамках запуска CLI
// Можно условно сказать, что в данной функции выполняется роутинг
// Для каждого роута (условия) есть своя изолированная функция-обработчик
const initCLI = () => {
	// process - глобальная переменная с информацией о процессе
	// process. просмотр доступных методов и переменных
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
	console.log("Weather APP");
};

initCLI();
