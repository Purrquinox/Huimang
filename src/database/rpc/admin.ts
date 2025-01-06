import { Users } from "../prisma.js";
import { RPCQL } from "../types/rpcql.js";

// Admin RPCQL Interface
const Admin: RPCQL = {
	namespace: "admin",
	actions: [
		{
			name: "perm_add",
			description: "Give user a permission.",
			params: [
				{
					name: "permission",
					description: "The permission to give to the user.",
				},
				{
					name: "user",
					description: "The user's ID to give the permission to.",
				},
				{
					name: "reason",
					description: "The reason for giving the permission.",
				},
			],
			permissionRequired: "admin.perm.add",
			execute: async (data, logAction) => {
				await PermissionAdd(data.permission, data.user, data.reason);
				logAction(data.user, data.reason, "Permission Added");
				return true;
			},
		},
		{
			name: "perm_remove",
			description: "Remove permission from user.",
			params: [
				{
					name: "permission",
					description: "The permission to remove from the user.",
				},
				{
					name: "user",
					description: "The user's ID to remove the permission from.",
				},
				{
					name: "reason",
					description: "The reason for removing the permission.",
				},
			],
			permissionRequired: "admin.perm.remove",
			execute: async (data, logAction) => {
				await PermissionRemove(data.permission, data.user, data.reason);
				logAction(data.user, data.reason, "Permission Removed");
				return true;
			},
		},
		{
			name: "role_add",
			description: "Give user a role.",
			params: [
				{
					name: "role",
					description: "The role to give to the user.",
				},
				{
					name: "user",
					description: "The user's ID to give the role to.",
				},
				{
					name: "reason",
					description: "The reason for giving the role.",
				},
			],
			permissionRequired: "admin.role.add",
			execute: async (data, logAction) => {
				await RoleAdd(data.role, data.user, data.reason);
				logAction(data.user, data.reason, "Role Added");
				return true;
			},
		},
		{
			name: "role_remove",
			description: "Remove role from user.",
			params: [
				{
					name: "role",
					description: "The role to remove from the user.",
				},
				{
					name: "user",
					description: "The user's ID to remove the role from.",
				},
				{
					name: "reason",
					description: "The reason for removing the role.",
				},
			],
			permissionRequired: "admin.role.remove",
			execute: async (data, logAction) => {
				await RoleRemove(data.role, data.user, data.reason);
				logAction(data.user, data.reason, "Role Removed");
				return true;
			},
		},
		{
			name: "badge_add",
			description: "Give user a badge.",
			params: [
				{
					name: "badge",
					description: "The badge to give to the user.",
				},
				{
					name: "user",
					description: "The user's ID to give the badge to.",
				},
				{
					name: "reason",
					description: "The reason for giving the badge.",
				},
			],
			permissionRequired: "admin.badge.add",
			execute: async (data, logAction) => {
				await BadgeAdd(data.badge, data.user, data.reason);
				logAction(data.user, data.reason, "Badge Added");
				return true;
			},
		},
		{
			name: "badge_remove",
			description: "Remove badge from user.",
			params: [
				{
					name: "badge",
					description: "The badge to remove from the user.",
				},
				{
					name: "user",
					description: "The user's ID to remove the badge from.",
				},
				{
					name: "reason",
					description: "The reason for removing the badge.",
				},
			],
			permissionRequired: "admin.badge.remove",
			execute: async (data, logAction) => {
				await BadgeRemove(data.badge, data.user, data.reason);
				logAction(data.user, data.reason, "Badge Removed");
				return true;
			},
		},
	],
};

// Permission Add
const PermissionAdd = async (
	permission: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.perms.push(permission);

		await Users.updateUser(target.id, {
			perms: target.perms,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Permission Remove
const PermissionRemove = async (
	permission: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.perms = target.perms.filter((p) => p !== permission);

		await Users.updateUser(target.id, {
			perms: target.perms,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Role Add
const RoleAdd = async (
	role: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.roles.push(role);

		await Users.updateUser(target.id, {
			roles: target.roles,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Role Remove
const RoleRemove = async (
	role: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.roles = target.roles.filter((r) => r !== role);

		await Users.updateUser(target.id, {
			roles: target.roles,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Badge Add
const BadgeAdd = async (
	badge: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.badges.push(badge);

		await Users.updateUser(target.id, {
			badges: target.badges,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Badge Remove
const BadgeRemove = async (
	badge: string,
	user: string,
	reason: string
): Promise<boolean | Error> => {
	try {
		let target = await Users.get({
			discordid: user,
		});
		target.badges = target.badges.filter((b) => b !== badge);

		await Users.updateUser(target.id, {
			badges: target.badges,
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// Export
export default Admin;
