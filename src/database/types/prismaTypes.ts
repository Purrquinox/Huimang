// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export enum InfractionAction {
	NONE = "NONE",
	LOSS_OF_PRIVILEGES = "LOSS_OF_PRIVILEGES",
	SUSPENSION = "SUSPENSION",
	TERMINATION = "TERMINATION",
	WARNING = "WARNING",
	OTHER = "OTHER",
}

export enum LOAStatus {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	DENIED = "DENIED",
}

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
	infractions: infractions[];
	issued_infractions: infractions[];
	leave_of_absences: leave_of_absences[];
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

export interface infractions {
	id: string;
	createdAt: Date;
	issuerId: string;
	targetId: string;
	issuer: users;
	target: users;
	reason: string;
	staff_notes?: string;
	expected_improvement?: string;
	corrective_action: InfractionAction;
	expiryTime?: Date;
	acknowledged: boolean;
}

export interface leave_of_absences {
	id: string;
	createdAt: Date;
	userId: string;
	user: users;
	start_date: Date;
	end_date: Date;
	reason: string;
	status: LOAStatus;
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
