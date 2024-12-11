const passport = require('passport');
const db = require('../database/queries');
const { body, validationResult } = require('express-validator');

const alphaNumericErr = 'must only contain letters and numbers.';
const userNameLengthErr = 'must be between 1 and 20 characters.';
const passwordLengthErr = 'must be 8 characters or more.';

const validateSignup = [
	body('username')
		.trim()
		.isAlphanumeric()
		.withMessage(`Username ${alphaNumericErr}`)
		.isLength({ min: 1, max: 20 })
		.withMessage(`Username ${userNameLengthErr}`)
		.custom(async (username) => {
			const user = await db.getUser(username);
			if (user !== null) {
				throw new Error('Username Already taken.');
			}
		}),
	body('password')
		.isLength({ min: 8 })
		.withMessage(`Password ${passwordLengthErr}`),
	body('confirmPassword')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Password and Confirm Password must match.'),
];

exports.getLoginPage = (req, res) => {
	const { messages } = req.session;

	res.render('login', {
		errors:
			messages && messages.length > 0 ? [{ msg: messages.pop() }] : [],
	});
};

exports.getSignupPage = (req, res) => {
	res.render('signup');
};

exports.postSignup = [
	validateSignup,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render('signup', { errors: errors.array() });
		}

		const { username, password } = req.body;
		await db.createUser(username, password);
		res.redirect('/');
	},
];

exports.postLogin = passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureMessage: true,
});
