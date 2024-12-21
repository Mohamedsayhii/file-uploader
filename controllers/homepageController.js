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
	const userId = req.session.passport.user;
	await db.deleteFolder(userId, foldername);
	res.redirect('/home');
};

exports.postUploadFile = [
	upload.single('uploaded_file'),
	async function (req, res) {
		const fileBuffer = req.file.buffer;
		const { originalname } = req.file;
		const { folders } = req.body;

		const { data, error } = await supabase.storage
			.from('uploads')
			.upload(`public/${originalname}`, fileBuffer, {
				contentType: req.file.mimetype,
			});

		if (error) {
			console.error('Supabase upload error:', error.message);
			return res.status(500).send('File upload failed');
		}

		await db.insertFile(originalname, req.file.size, folders, null);
		res.redirect(`/home/${folders}/show`);
	},
];

exports.postDeleteFile = async (req, res) => {
	const { filename } = req.params;
	await db.deleteFile(filename);
	res.redirect('/home');
};

exports.getLogout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
