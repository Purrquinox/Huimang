import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Users } from "../../database/prisma.js";
import { Embed } from "../../common.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("admin")
			.setDescription("Access administrator actions.")
			.addSubcommand((command) =>
				command
					.setName("perm_add")
					.setDescription("Give user a permission.")
					.addStringOption((perm) =>
						perm
							.setName("permission")
							.setDescription(
								"The permission to give to the user."
							)
							.setRequired(true)
					)
					.addUserOption((user) =>
						user
							.setName("user")
							.setDescription(
								"The user to give the permission to."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((command) =>
				command
					.setName("perm_remove")
					.setDescription("Remove permission from user.")
					.addStringOption((perm) =>
						perm
							.setName("permission")
							.setDescription(
								"The permission to remove from the user."
							)
							.setRequired(true)
					)
					.addUserOption((user) =>
						user
							.setName("user")
							.setDescription(
								"The user to remove the permission from."
							)
							.setRequired(true)
					)
			),
		category: "admin",
		accountRequired: true,
		permissionRequired: "admin.*",
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		// Add Permission
		if (interaction.options.getSubcommand() === "perm_add") {
			let target = await Users.get({
				discordid: interaction.options.getUser("user").id,
			});

			if (target) {
				const perm = interaction.options.getString("permission");
				target.perms.push(perm);

				await Users.updateUser(target.id, {
					perms: target.perms,
				});

				await interaction.reply({
					embeds: [
						new Embed()
							.setTitle("Permission Added")
							.setDescription(
								`The permission \`${perm}\` has been added to the user \`${
									interaction.options.getUser("user").username
								}\`.`
							)
							.default(interaction),
					],
				});
			}
		}

		// Remove Permission
		if (interaction.options.getSubcommand() === "perm_remove") {
			let target = await Users.get({
				discordid: interaction.options.getUser("user").id,
			});

			if (target) {
				const perm = interaction.options.getString("permission");
				target.perms = target.perms.filter((p) => p != perm);

				await Users.updateUser(target.id, {
					perms: target.perms,
				});

				await interaction.reply({
					embeds: [
						new Embed()
							.setTitle("Permission Removed")
							.setDescription(
								`The permission \`${perm}\` has been removed from the user \`${
									interaction.options.getUser("user").username
								}\`.`
							)
							.default(interaction),
					],
				});
			}
		}
	},
	async autocomplete(client, interaction) {},
};
