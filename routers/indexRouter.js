const { Router } = require('express');
const {
	getLoginPage,
	getSignupPage,
	postSignup,
	postLogin,
} = require('../controllers/indexController');

const indexRouter = Router();

indexRouter.get('/', getLoginPage);
indexRouter.post('/', postLogin);
indexRouter.get('/signup', getSignupPage);
indexRouter.post('/signup', postSignup);

module.exports = indexRouter;
