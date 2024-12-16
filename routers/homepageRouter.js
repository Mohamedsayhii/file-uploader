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
	postDeleteFile,
} = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);
homepageRouter.post('/createfolder', postCreateFolderForm);
homepageRouter.get('/:foldername/show', getFolder);
homepageRouter.post('/folder/:foldername/delete', postDeleteFolder);
homepageRouter.post('/uploadfile', postUploadFile);
homepageRouter.post('/file/:filename/delete', postDeleteFile);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
