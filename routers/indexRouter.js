const { Router } = require('express');
const {
	getLoginPage,
	getSignupPage,
} = require('../controllers/indexController');
const indexRouter = Router();

indexRouter.get('/', getLoginPage);
indexRouter.get('/signup', getSignupPage);

module.exports = indexRouter;
