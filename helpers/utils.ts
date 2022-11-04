import { ComponentType } from "react";

/**
 * Helper that return the correct greeting message
 *
 * @returns
 */
export function getCorrectGreeting(): string {
	const DATE = new Date();
	const HOURS = DATE.getHours();

	if (HOURS >= 6 && HOURS <= 11) {
		return "Good Morning";
	} else if (HOURS >= 17 && HOURS <= 22) {
		return "Good Evening";
	} else if (HOURS === 23 || (HOURS >= 0 && HOURS <= 5)) {
		return "Good Night";
	}
	return "Hello";
}

/**
 *
 * @param _Component
 * @returns
 */
export function getReactComponentProps<Props>(
	_Component: ComponentType<Props>
): Props {
	return {} as unknown as Props;
}

/**
 *
 * @param data
 * @returns
 */
export function isEmpty(data: any) {
	switch (typeof data) {
		case "object":
			for (const prop in data) {
				if (data.hasOwnProperty(prop)) {
					return false;
				}
			}
			return JSON.stringify(data) === JSON.stringify({}) || data === null;

		case "string":
			return !data && !data.trim().length && data != null;

		case "number":
			return !data && !isNaN(data);

		case "boolean":
			return !data;

		default:
			return true;
	}
}

/**
 *
 * @param {object} object Object that will be tested
 * @param {string[]} except fields that will be excepted
 * @description Function that will test Object items one by one & return an object of empty fields
 * @returns Array
 */
export function testObjectItem(
	object: { [key: string]: any },
	except: string[] = []
) {
	if (typeof object != "object") {
		return console.warn("This function require a object");
	}

	const arrayKey = [];

	for (const key in object) {
		if (Object.hasOwnProperty.call(object, key)) {
			if (isEmpty(object[key]) && except.includes(key)) {
				arrayKey.push(key);
			}
		}
	}
	return arrayKey;
}

/**
 *
 * @param length
 * @returns
 */
export function plurallify(length: number) {
	if (length > 1) {
		return "s";
	} else {
		return "";
	}
}

/**
 *
 * @param date
 * @returns
 */
export function formatNativeDate(date = "") {
	let d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	d = d;
	year = year;
	if (month.length < 2) {
		month = "0" + month;
	}
	if (day.length < 2) {
		day = "0" + day;
	}

	return [year, month, day].join("-");
}

/**
 *
 * @param min
 * @param max
 * @returns
 */
export function generateRandomNum(min = 0, max = 100) {
	// find diff
	const difference: number = max - min;

	// generate random number
	let rand: number = Math.random();

	// multiply with difference
	rand = Math.floor(rand * difference);

	// add with min value
	rand = rand + min;

	return rand;
}
