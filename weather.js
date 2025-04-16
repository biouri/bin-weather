#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printHelp } from './services/log-service.js';
import { saveKeyValue } from './services/storage-service.js'

// Функция, которую будем вызывать в рамках запуска CLI
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
		saveKeyValue('token', args.t);
	}
	// Вывести погоду
	console.log("Weather APP");
};

initCLI();
