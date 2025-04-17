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

// Чтение/Запись файлов (в данном случае используем promises)
// writeFileSync - синхронно записать данные в файл (используется редко)
// writeFile - асинхронная запись данных в файл
// promises - современный метод для получения информации об ОС, читать, записывать.
import { promises } from 'fs';

// join() использует особенности ОС при конкатенации
// join() умеет корректно обрабатывать переходы в каталоги '../weather-data.json'
const filePath = join(homedir(), 'weather-data.json');

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
