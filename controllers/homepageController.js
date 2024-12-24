const db = require('../database/queries');
const multer = require('multer');

function toArrayBuffer(buffer) {
	return buffer.buffer.slice(
		buffer.byteOffset,
		buffer.byteOffset + buffer.byteLength
	);
}

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
	const userId = req.user.id;
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
	const userId = req.user.id;
	const folders = await db.getAllFolders(userId);
	const files = await db.getFilesByFolder(userId, foldername);
	res.render('homepage', { folders: folders, files: files });
};

exports.postDeleteFolder = async (req, res) => {
	const { foldername } = req.params;
	const userId = req.user.id;
	await db.deleteFolder(userId, foldername);
	res.redirect('/home');
};

exports.postUploadFile = [
	upload.single('uploaded_file'),
	async function (req, res) {
		const userBucket = req.user.id;
		const fileName = `${req.file.originalname}`;
		const fileType = req.file.mimetype;
		const filePath = `uploads/${fileName}`;
		const fileData = req.file.buffer;
		const buffer = toArrayBuffer(fileData);
		const bucketExists = await supabase.bucketExists(userBucket);

		if (!bucketExists) {
			supabase.createBucket(userBucket);
		}

		supabase.uploadFileToSupabase(userBucket, filePath, buffer, fileType);

		await db.insertFile(
			req.file.originalname,
			req.file.size,
			req.body.folders
		);
		res.redirect(`/home`);
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
