const { Router } = require('express');
const {
	getHomepage,
	getLogout,
	postCreateFolderForm,
	postDeleteFolder,
	postUploadFile,
	getFolder,
	postDownloadFile,
	postDeleteFile,
} = require('../controllers/homepageController');

const homepageRouter = Router();

homepageRouter.get('/', getHomepage);
homepageRouter.post('/createfolder', postCreateFolderForm);
homepageRouter.get('/:foldername/show', getFolder);
homepageRouter.post('/folder/:foldername/delete', postDeleteFolder);
homepageRouter.post('/uploadfile', postUploadFile);
homepageRouter.post('/file/:filename/download', postDownloadFile);
homepageRouter.post('/file/:filename/delete', postDeleteFile);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
