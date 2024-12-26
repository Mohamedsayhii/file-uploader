const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findFirst({
				where: {
					username,
				},
			});

			if (!user) {
				return done(null, false, { message: 'Incorrect Username' });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: 'Incorrect Password' });
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findFirst({ where: { id } });
		done(null, user);
	} catch (err) {
		done(err);
	}
});
