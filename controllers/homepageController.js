const db = require('../database/queries');

exports.getHomepage = async (req, res) => {
	const userId = req.session.passport.user;
	const folders = await db.getAllFolders(userId);
	res.render('homepage', { folders: folders });
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

exports.getLogout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
