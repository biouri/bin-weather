const getArgs = (args) => {
	const res = {};
	// Игнорировать первые два аргумента
	// Используется rest синтаксис для массивов 
	// rest это массив без первых 2-х аргументов
	const [executer, file, ...rest] = args;
	rest.forEach((value, index, array) => {
		if (value.charAt(0) == '-') {
			if (index == array.length - 1) {
				// Это последний элемент, true = значит мы его нашли
				res[value.substring(1)] = true;
			} else if (array[index + 1].charAt(0) != '-') {
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

export { getArgs }
