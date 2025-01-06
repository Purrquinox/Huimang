// Packages
import { hasPerm } from "../perms.js";
import { EmbedBuilder, WebhookClient } from "discord.js";
import fs from "fs";
import path from "path";
import * as database from "./prisma.js";
import { RPCQL } from "./types/rpcql.js";

// Check if a user has a permission
const checkPerms = async (userid: string, perm: string) => {
	const user = await database.Users.get({
		discordid: userid,
	});

	if (!user) return false;
	else return hasPerm(user?.perms, perm);
};

// Get files from directory
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

// Log actions
const logAction = async (
	userid: string,
	reason: string,
	action: string
): Promise<boolean | Error> => {
	try {
		const webhookClient = new WebhookClient({
			id: process.env.DISCORD_LOG_CHANNEL,
			token: process.env.DISCORD_LOG_CHANNEL_TOKEN,
		});

		const staffMember = await database.Users.get({
			discordid: userid,
		});

		webhookClient.send({
			embeds: [
				new EmbedBuilder()
					.setTitle(`New RPCQL Activity`)
					.setDescription(
						"A new RPCQL activity has been logged. Please review throughly to ensure that this action was done in good faith. Abuse of this system will result in immediate termination"
					)
					.setColor("Random")
					.setAuthor({
						name: staffMember.username,
						iconURL: staffMember.avatar,
					})
					.setThumbnail(staffMember.avatar)
					.addFields(
						{
							name: "Action",
							value: action,
							inline: true,
						},
						{
							name: "Reason",
							value: reason,
							inline: true,
						}
					)
					.setTimestamp(),
			],
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// RPC
let availableEntities: RPCQL[] = [];
const entityFiles = getFilesInDirectory("./dist/database/rpc").filter((file) =>
	file.endsWith(".js")
);

for (const file of entityFiles) {
	import(`../../${file}`)
		.then((module) => {
			const i: RPCQL = module.default;
			i.actions.map((p) => {
				p.params.push({
					name: "staff_id",
					description: "The staff member's ID performing the action.",
				});
			});

			availableEntities.push({
				namespace: i.namespace,
				actions: i.actions,
			});
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

const Query = async (action: string, data: any): Promise<boolean | Error> => {
	const entity = availableEntities.find(
		(p) => p.namespace === action.split(".")[0]
	);
	const entityAction = entity.actions.find(
		(p) => p.name === action.split(".")[1]
	);

	if (entityAction) {
		if (await checkPerms(data.staff_id, entityAction.permissionRequired)) {
			const ActionParams = entityAction.params.map((p) => p.name);

			if (Object.keys(data).every((key) => ActionParams.includes(key)))
				return await entityAction?.execute(data, logAction);
			else return new Error("[RPC Error] => Invalid Parameters.");
		} else
			return new Error(
				"[RPC Error] => You do not have permission to do this action."
			);
	}
};

export { Query, availableEntities };
