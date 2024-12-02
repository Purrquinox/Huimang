// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export enum Service {
	SPARKYFLIGHT = "SPARKYFLIGHT",
	ANTIRAID = "ANTIRAID",
	SELECTDEV = "SELECTDEV",
}

export interface users {
	id: string;
	discordid?: string;
	username: string;
	bio: string;
	avatar: string;
	roles: string[];
	perms: string[];
	badges: string[];
	posts: blogposts[];
	applications: applications[];
}

export interface blogposts {
	id: string;
	title: string;
	content: string;
	flairs: string[];
	service: Service;
	author: users;
	authorId: string;
}

export interface applications {
	creatorid: string;
	owner: users;
	name: string;
	logo: string;
	token: string;
	active: boolean;
	permissions: string[];
}
