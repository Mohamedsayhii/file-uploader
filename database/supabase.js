const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
	'https://lmoevozxjtkkdzgzhodp.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2V2b3p4anRra2R6Z3pob2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjgyNTgsImV4cCI6MjA1MDEwNDI1OH0.p0kyQXeW5aXPuozRkqdvuS0v62Vgm4OV6ItOpYvCFqo'
);

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

const uploadFileToSupabase = async (
	bucketName,
	filePath,
	fileData,
	fileType
) => {
	const { data, error } = await supabase.storage
		.from(bucketName)
		.upload(filePath, fileData, {
			cacheControl: '3600',
			contentType: fileType,
			upsert: false,
		});

	if (error) {
		console.log('Failed to upload', error);
	} else {
		console.log('Upload was successful');
	}
};

module.exports = {
	bucketExists,
	createBucket,
	uploadFileToSupabase,
};
