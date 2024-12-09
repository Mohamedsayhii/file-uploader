const { Router } = require('express');
const {
	getLoginPage,
	getSignupPage,
	postSignup,
} = require('../controllers/indexController');
const indexRouter = Router();

indexRouter.get('/', getLoginPage);
indexRouter.get('/signup', getSignupPage);
indexRouter.post('/signup', postSignup);

module.exports = indexRouter;
