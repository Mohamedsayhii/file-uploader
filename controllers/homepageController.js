const multer = require('multer');
const db = require('../database/queries');
const supabase = require('../database/supabase');

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
	await db.createFolder(foldername, req.user.id);
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
		try {
			const fileName = `${req.file.originalname}`;
			const fileType = req.file.mimetype;
			const filePath = `uploads/${fileName}`;
			const fileData = req.file.buffer;

			console.log('Uploading file:', fileName, 'Type:', fileType);

			const bucketExists = await supabase.bucketExists('uploads');

			if (!bucketExists) {
				console.log('Bucket does not exist. Creating bucket...');
				await supabase.createBucket('uploads');
			}

			await supabase.uploadFileToSupabase(filePath, fileData, fileType);

			console.log('File uploaded successfully.');

			await db.insertFile(
				req.file.originalname,
				req.file.size,
				req.body.folders
			);

			res.redirect(`/home`);
		} catch (error) {
			console.error('Error during file upload:', error.message);
			res.status(500).send('File upload failed.');
		}
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
