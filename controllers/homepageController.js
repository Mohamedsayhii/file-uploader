const db = require('../database/queries');
const multer = require('multer');

const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
	'https://lmoevozxjtkkdzgzhodp.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2V2b3p4anRra2R6Z3pob2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjgyNTgsImV4cCI6MjA1MDEwNDI1OH0.p0kyQXeW5aXPuozRkqdvuS0v62Vgm4OV6ItOpYvCFqo'
);

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
