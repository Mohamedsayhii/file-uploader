const db = require('../database/queries');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

exports.getHomepage = async (req, res) => {
	const userId = req.session.passport.user;
	const folders = await db.getAllFolders(userId);
	const files = await db.getAllFiles();
	res.render('homepage', { folders: folders, files: files });
};

exports.getCreateFolderForm = async (req, res) => {
	const userId = req.session.passport.user;
	const folders = await db.getAllFolders(userId);
	res.render('homepage', { showModal: 'folder', folders: folders });
};

exports.postCreateFolderForm = async (req, res) => {
	const { foldername } = req.body;
	await db.createFolder(foldername, req.session.passport.user);
	res.redirect('/home');
};

exports.getFolder = async (req, res) => {
	const { foldername } = req.params;
	const userId = req.session.passport.user;
	const folders = await db.getAllFolders(userId);
	const files = await db.getFilesByFolder(userId, foldername);
	res.render('homepage', { folders: folders, files: files });
};

exports.postDeleteFolder = async (req, res) => {
	const { foldername } = req.params;
	await db.deleteFolder(foldername);
	res.redirect('/home');
};

exports.getUploadFileForm = async (req, res) => {
	const userId = req.session.passport.user;
	const folders = await db.getAllFolders(userId);
	res.render('homepage', { showModal: 'file', folders: folders });
};

exports.postUploadFile = [
	upload.single('uploaded_file'),
	async function (req, res) {
		await db.insertFile(
			req.file.originalname,
			req.file.size,
			req.body.folders
		);
		res.redirect('/home');
	},
];

exports.getLogout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
