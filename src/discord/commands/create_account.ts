import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Users } from "../../database/prisma.js";
import { Embed } from "../../common.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("create_account")
			.setDescription("Create an Huimang account.")
			.addStringOption((option) =>
				option
					.setName("bio")
					.setDescription("Write a description about yourself.")
					.setRequired(true)
			),
		category: "account",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		let user = await Users.get({
			discordid: interaction.user.id,
		});

		if (user) {
			await interaction.reply({
				embeds: [
					new Embed()
						.setTitle("Oops! Already Have an Account!")
						.setDescription(
							"You already have an account linked to this Discord account. If you need help or have any questions, please don't hesitate to ask."
						)
						.default(interaction),
				],
			});
			return;
		}

		const create = await Users.createUser(
			interaction.user.username,
			interaction.options.getString("bio"),
			interaction.user.displayAvatarURL({ extension: "jpg" })
		);

		if (create) {
			user = await Users.get({
				username: interaction.user.username,
			});

			if (user) {
				const update = await Users.updateUser(user.id, {
					discordid: interaction.user.id,
					perms: ["user.read"],
				});

				if (update) {
					await interaction.reply({
						embeds: [
							new Embed()
								.setTitle("Account Created")
								.setDescription(
									`Your account has been created with the username \`${interaction.user.username}\`. You can now use Huimang commands and features.`
								)
								.default(interaction),
						],
					});
				}
			}
		}
	},
	async autocomplete(client, interaction) {},
};
