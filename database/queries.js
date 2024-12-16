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

const deleteFolder = async (folderName) => {
	await prisma.folder.delete({
		where: {
			name: folderName,
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

const insertFile = async (name, size, folderName) => {
	const { id: folderId } = await prisma.folder.findUnique({
		where: {
			name: folderName,
		},
		select: {
			id: true,
		},
	});

	console.log(folderId);

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
};
