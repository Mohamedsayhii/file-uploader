const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
	'https://lmoevozxjtkkdzgzhodp.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2V2b3p4anRra2R6Z3pob2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDUyODI1OCwiZXhwIjoyMDUwMTA0MjU4fQ.OeMrthS88qeExKVUYn6Fmm8woZTtJG4nYQktE-hEqKY'
);

const bucketExists = async (bucketName) => {
	const { data, error } = await supabase.storage.getBucket(bucketName);

	if (error) {
		console.error('Error checking bucket existence:', error.message);
		return false;
	}

	return !!data;
};

const createBucket = async (bucketName) => {
	const { data, error } = await supabase.storage.createBucket(bucketName, {
		public: false,
		fileSizeLimit: 5000000,
	});

	if (error) {
		console.error('Failed to create bucket:', error.message);
	} else {
		console.log('Bucket created:', data);
	}
};

const uploadFileToSupabase = async (filePath, fileData, fileType) => {
	const { data, error } = await supabase.storage
		.from('uploads')
		.upload(filePath, fileData, {
			cacheControl: '3600',
			contentType: fileType,
			upsert: false,
		});

	if (error) {
		console.error('Failed to upload:', error);
	} else {
		console.log('Upload was successful:', data);
	}
};

module.exports = {
	bucketExists,
	createBucket,
	uploadFileToSupabase,
};
