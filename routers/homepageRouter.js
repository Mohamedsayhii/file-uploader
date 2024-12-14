const { Router } = require('express');
const {
	getHomepage,
	getLogout,
	getUploadFileForm,
	getCreateFolderForm,
	postCreateFolderForm,
	postDeleteFolder,
} = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);
homepageRouter.get('/createfolder', getCreateFolderForm);
homepageRouter.post('/createfolder', postCreateFolderForm);
homepageRouter.post('/:foldername/delete', postDeleteFolder);
homepageRouter.get('/uploadfile', getUploadFileForm);
// homepageRouter.post('/uploadfile', postUploadFileForm);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
