const { Router } = require('express');
const {
	getHomepage,
	getLogout,
	getUploadFileForm,
	getCreateFolderForm,
	postCreateFolderForm,
	postDeleteFolder,
} = require('../controllers/homepageController');
const multer = require('multer');

const homepageRouter = Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

homepageRouter.get('/', getHomepage);
homepageRouter.get('/createfolder', getCreateFolderForm);
homepageRouter.post('/createfolder', postCreateFolderForm);
homepageRouter.post('/:foldername/delete', postDeleteFolder);
homepageRouter.get('/uploadfile', getUploadFileForm);
homepageRouter.post(
	'/uploadfile',
	upload.single('uploaded_file'),
	function (req, res) {
		console.log(req.file, req.body);
		res.redirect('/home');
	}
);
homepageRouter.get('/logout', getLogout);

module.exports = homepageRouter;
