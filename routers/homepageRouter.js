const { Router } = require('express');
const { getHomepage } = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);

module.exports = homepageRouter;
