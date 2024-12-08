const { Router } = require('express');
const { getLoginPage } = require('../controllers/indexController');
const indexRouter = Router();

indexRouter.get('/', getLoginPage);

module.exports = indexRouter;
