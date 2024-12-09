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

module.exports = { createUser, getUser };
