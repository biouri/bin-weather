import https from 'https';
import axios from 'axios';
import { getKeyValue, TOKEN_DICTIONARY } from './storage-service.js';

const getIcon = (icon) => {
	switch (icon.slice(0, -1)) {
		case '01':
			return '☀️';
		case '02':
			return '🌤️';
		case '03':
			return '☁️';
		case '04':
			return '☁️';
		case '09':
			return '🌧️';
		case '10':
			return '🌦️';
		case '11':
			return '🌩️';
		case '13':
			return '❄️';
		case '50':
			return '🌫️';
	}
};

const getWeather = async (city) => {
	// Если задана переменная окружения TOKEN, иначе из файла-настроек
	const token = process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token);
	if (!token) {
		throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
	}
	// В Axios удобный способ конструирования запроса с дополнительной опцией params
	// В ответе содержатся данные data и др. информация: headers, response ...
	const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			q: city,
			appid: token,
			lang: 'ru',
			units: 'metric'
		}
	});
	return data;
};

// Классический способ выполнения запроса при помощи https используется редко
const getWeatherHTTPS = async (city) => {
	// Хорошо бы обернуть весь код ниже в Promise и использовать resolve/reject
	// Но это все не очень удобно и сложно
	// return new Promise(...);

	// Ниже код, который желательно оборачивать в Promise
	// Если задана переменная окружения TOKEN, иначе из файла-настроек
	const token = process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token);
	if (!token) {
		throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
	}

	// Пример URL для запроса в API
	// const url = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);

	// Формирование URL с добавлением параметров
	// 12:04
	const url = new URL('https://api.openweathermap.org/data/2.5/weather');
	url.searchParams.append('q', city);
	url.searchParams.append('appid', token);
	url.searchParams.append('lang', 'ru');
	url.searchParams.append('units', 'metric');

	// Запрос и получение результата response
	https.get(url, (response) => {
		let res = '';
		// Подписаться на получение данных
		// Обычно кусочек получаемых данных называют chunk
		response.on('data', (chunk) => {
			res += chunk;
		});

		// Подписка на завершение
		// Вывести результат
		response.on('end', () => {
			console.log(`Ответ строка: ${res}`);
			// Парсим строку в объект
			// JSON.parse(jsonString) — превращает строку в объект.
			// JSON.stringify(..., null, 2) — превращает объект обратно в строку, но с отступами в 2 пробела.
			console.log(`JSON: ${JSON.stringify(JSON.parse(res), null, 2) }`);
		});
		
		// Аналогично можно подписаться на ошибки, на паузу, на закрытие канала
		response.on('error', (error) => {
			// Обработка ошибки
			console.log(`Error: ${error}`);
			return;
		});
	});
}

export { getIcon, getWeather, getWeatherHTTPS };
