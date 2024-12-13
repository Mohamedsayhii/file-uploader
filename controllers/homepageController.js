exports.getHomepage = (req, res) => {
	res.render('homepage');
};

exports.getCreateFolderForm = (req, res) => {
	res.render('homepage', { showModal: 'folder' });
};

exports.getUploadFileForm = (req, res) => {
	res.render('homepage', { showModal: 'file' });
};

exports.getLogout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
