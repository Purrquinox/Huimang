// Import packages
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const prisma = new PrismaClient(); // Configure PrismaClient

// Users
class Users {
	static async createUser(username: string, bio: string, avatar: string) {
		try {
			await prisma.users.create({
				data: {
					username: username,
					bio: bio,
					avatar: avatar,
					roles: [],
					perms: [],
					badges: [],
				},
			});

			return true;
		} catch (error) {
			return error;
		}
	}

	static async get(data: any) {
		const doc = await prisma.users.findUnique({
			where: data,
			include: {
				posts: true,
				applications: false,
			},
		});

		if (!doc) return null;
		else return doc;
	}

	static async find(data: any) {
		const docs = await prisma.users.findMany({
			where: data,
			include: {
				posts: true,
				applications: false,
			},
		});

		return docs;
	}

	static async updateUser(id: string, data: object) {
		try {
			await prisma.users.update({
				where: {
					id: id,
				},
				data: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async delete(id: string) {
		try {
			await prisma.applications.deleteMany({
				where: {
					creatorid: id,
				},
			});

			await prisma.blogposts.deleteMany({
				where: {
					authorId: id,
				},
			});

			await prisma.users.delete({
				where: {
					id: id,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}
}

// Developer Applications
class Applications {
	static async createApp(creator_id: string, name: string, logo: string) {
		try {
			const token: string = crypto
				.createHash("sha256")
				.update(
					`${crypto.randomUUID()}_${crypto.randomUUID()}`.replace(
						/-/g,
						""
					)
				)
				.digest("hex");

			await prisma.applications.create({
				data: {
					creatorid: creator_id,
					name: name,
					logo: logo,
					token: token,
					active: true,
					permissions: ["global.*"],
				},
			});

			return token;
		} catch (err) {
			return err;
		}
	}

	static async updateApp(token: string, data: any) {
		try {
			await prisma.applications.update({
				data: data,
				where: {
					token: token,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async regenerateToken(token: string) {
		const tokenData = await prisma.applications.findUnique({
			where: {
				token: token,
			},
			include: {
				owner: true,
			},
		});

		const newToken: string = crypto
			.createHash("sha256")
			.update(
				`${crypto.randomUUID()}_${crypto.randomUUID()}`.replace(
					/-/g,
					""
				)
			)
			.digest("hex");

		if (tokenData) {
			try {
				await prisma.applications.update({
					data: {
						token: newToken,
					},
					where: {
						token: token,
					},
				});

				return true;
			} catch (err) {
				return err;
			}
		}
	}

	static async get(token: string) {
		const tokenData = await prisma.applications.findUnique({
			where: {
				token: token,
			},
			include: {
				owner: true,
			},
		});

		if (tokenData) return tokenData;
		else return null;
	}

	static async getAllApplications(creatorid: string) {
		try {
			const doc = await prisma.applications.findMany({
				where: {
					creatorid: creatorid,
				},
				include: {
					owner: true,
				},
			});

			return doc;
		} catch (error) {
			return error;
		}
	}

	static async delete(data: any) {
		try {
			await prisma.applications.delete({
				where: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}
}

// Export Classes
export { Users, Applications };
