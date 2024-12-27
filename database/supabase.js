const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lmoevozxjtkkdzgzhodp.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2V2b3p4anRra2R6Z3pob2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjgyNTgsImV4cCI6MjA1MDEwNDI1OH0.p0kyQXeW5aXPuozRkqdvuS0v62Vgm4OV6ItOpYvCFqo';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

const bucketExists = async (bucketName) => {
	const { data, error } = await supabase.storage.getBucket(bucketName);

	if (data) {
		return true;
	} else {
		return false;
	}
};

const createBucket = async (bucketName) => {
	const { data, error } = await supabase.storage.createBucket(bucketName, {
		public: false,
		fileSizeLimit: 5000000,
	});

	if (error) {
		console.log('Failed to create bucket', error);
	} else {
		console.log('Created bucket', data);
	}
};

async function uploadFile(file) {
	const { data, error } = await supabase.storage
		.from('uploads')
		.upload(`uploads/${file.originalname}`, file);

	if (error) {
		console.error('Error uploading file:', error.message);
		return null;
	}

	console.log('File uploaded successfully:', data);
	return data.path;
}

const downloadFile = async (bucketName, fileName) => {
	const { data, error } = await supabase.storage
		.from(bucketName)
		.createSignedUrl(`uploads/${fileName}`, 2, {
			download: true,
		});

	if (error) {
		console.log('Failed to download', error);
	} else {
		console.log('Downloaded successfully', data);
		return data.signedUrl;
	}
};

module.exports = {
	uploadFile,
	downloadFile,
};
