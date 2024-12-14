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

module.exports = {
	createUser,
	getUser,
	getUserById,
	getAllFolders,
	createFolder,
	deleteFolder,
};
