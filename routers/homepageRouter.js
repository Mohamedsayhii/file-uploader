const { Router } = require('express');
const {
	getHomepage,
	getLogout,
	getUploadFileForm,
	getCreateFolderForm,
	postCreateFolderForm,
	postDeleteFolder,
	postUploadFile,
	getFolder,
} = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);
homepageRouter.get('/createfolder', getCreateFolderForm);
homepageRouter.post('/createfolder', postCreateFolderForm);
homepageRouter.get('/:foldername/show', getFolder);
homepageRouter.post('/:foldername/delete', postDeleteFolder);
homepageRouter.get('/uploadfile', getUploadFileForm);
homepageRouter.post('/uploadfile', postUploadFile);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
