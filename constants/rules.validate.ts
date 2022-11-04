// This file contain rule validation constants for validate.js
import { validators, extend } from 'validate.js';

// HELPERS
import { formatWithTz } from '../helpers/utils';

extend(validators.datetime, {
	parse: function (_value: any, _options: any) {
		return new Date(_value);
	},
	format: function (_value: any, _options: any) {
		const FORMAT = _options.dateOnly ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
		return formatWithTz(_value, FORMAT);
	},
});

// TODO: #2 Set types for validation rule constants

/**
 * Require a non-empty field
 */
export const NOT_ALLOW_EMPTY_PRESENCE = {
	allowEmpty: false,
};

// TODO: #4 Add descriptive comments for validation rule constants
export const TEL_FORMAT = {
	pattern: /^[0-9]?()[0-9](\s|\S)(\d[0-9]{9})$/,
};

export const NUMERIC_FORMAT = {
	pattern: /^[0-9]+$/,
};

export const REQUIRE_NOT_EMPTY_PRESENCE = {
	presence: NOT_ALLOW_EMPTY_PRESENCE,
};

export const REQUIRE_EMAIL = {
	...REQUIRE_NOT_EMPTY_PRESENCE,
	email: true,
};

export const REQUIRE_NUMERIC = {
	numericality: {
		format: {
			...NUMERIC_FORMAT,
		},
		strict: true,
	},
};

export const REQUIRE_NUMERIC_NOT_STRICK = {
	numericality: {
		format: {
			...NUMERIC_FORMAT,
		},
		strict: false,
	},
};

export const REQUIRE_DATE_TIME = {
	datetime: {},
};

export const REQUIRE_DATE_ONLY = {
	datetime: {
		dateOnly: true,
	},
};
