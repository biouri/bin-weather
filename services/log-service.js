// До пятой версии библиотеки chalk использовался CommonJS импорт
// const chalk = require('chalk');
// ES6 импорт для chalk > v.5.0.0 (CommonJS больше не используется)
import chalk from 'chalk';
import dedent from 'dedent-js';

// Методы для вывода в консоль

// Вывод в консоль сообщения об ошибке
const printError = (error) => {
	console.log(chalk.bgRed(' ERROR ') + ' ' + error);
};

// Стандартный вывод сообщения
const printSuccess = (message) => {
	console.log(chalk.bgGreen(' SUCCESS ') + ' ' + message);
};

// Подсказка
const printHelp = () => {
	// Используется краткая запись передачи строки в фукнцию dedent()
	// dedent`...` можно применять чтобы убрать лишние отступы
	console.log(
		dedent`${chalk.bgCyan(' HELP ')}
		Без параметров - вывод погоды
		-s [CITY] для установки города
		-h для вывода помощи
		-t [API_KEY] для сохранения токена
		`
	);
};

const printWeather = (res, icon) => {
	console.log(
		dedent`${chalk.bgYellow(' WEATHER ')} Погода в городе ${res.name}
		${icon}  ${res.weather[0].description}
		Температура: ${res.main.temp} (ощущается как ${res.main.feels_like})
		Влажность: ${res.main.humidity}%
		Скорость ветра: ${res.wind.speed}
		`
	);
};

export { printError, printSuccess, printHelp, printWeather };
