// instantiate the client
const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const createUser = async (username, password) => {
	const cryptedPassword = await bcryptjs.hash(password, 10);
	await prisma.user.create({
		data: {
			username: username,
			password: cryptedPassword,
		},
	});
};

const getUser = async (username) => {
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});

	return user;
};

const getUserById = async (id) => {
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	return user;
};

const getAllFolders = async (userId) => {
	const folders = await prisma.folder.findMany({
		where: {
			userId: userId,
		},
	});
	return folders;
};

const createFolder = async (folderName, userId) => {
	await prisma.folder.create({
		data: {
			name: folderName,
			userId: userId,
		},
	});
};

const deleteFolder = async (userId, folderName) => {
	const { id: folderId } = await prisma.folder.findUnique({
		where: {
			name: folderName,
			userId: userId,
		},
		select: {
			id: true,
		},
	});

	await prisma.file.deleteMany({
		where: {
			folderId: folderId,
		},
	});

	await prisma.folder.delete({
		where: {
			name: folderName,
		},
	});
};

const deleteAllFilesInFolder = async (folderId) => {
	await prisma.file.deleteMany({
		where: {
			folderId: folderId,
		},
	});
};

const getAllFiles = async () => {
	files = await prisma.file.findMany({});
	return files;
};

const getFilesByFolder = async (userId, folderName) => {
	const { id: folderId } = await prisma.folder.findUnique({
		where: {
			name: folderName,
			userId: userId,
		},
		select: {
			id: true,
		},
	});

	const files = await prisma.file.findMany({
		where: {
			folderId: folderId,
		},
	});

	return files;
};

const insertFile = async (name, size, folderName, file) => {
	const { id: folderId } = await prisma.folder.findUnique({
		where: {
			name: folderName,
		},
		select: {
			id: true,
		},
	});

	const uploadTime = new Date();

	await prisma.file.create({
		data: {
			name: name,
			size: size,
			folderId: folderId,
			uploadTime: uploadTime,
		},
	});
};

const deleteFile = async (filename) => {
	await prisma.file.delete({
		where: {
			name: filename,
		},
	});
};

module.exports = {
	createUser,
	getUser,
	getUserById,
	getAllFolders,
	createFolder,
	deleteFolder,
	getAllFiles,
	getFilesByFolder,
	insertFile,
	deleteFile,
	deleteAllFilesInFolder,
};
