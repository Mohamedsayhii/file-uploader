const { Router } = require('express');
const { getHomepage, getLogout } = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
