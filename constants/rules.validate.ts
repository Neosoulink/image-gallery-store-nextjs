// This file contain rule validation constants for validate.js
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
