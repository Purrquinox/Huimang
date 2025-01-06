import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Embed, permissions } from "../../common.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("perm-table")
			.setDescription("Return table of available permissions."),
		category: "staff",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		let embed = new Embed()
			.setTitle("Available Permissions:")
			.setDescription(
				"This is a list of available permissions registered on this service."
			)
			.addFields(
				permissions.map((p) => {
					return {
						name: p.namespace,
						value: `- ${p.permissions.join("\n- ")}`,
						inline: false,
					};
				})
			)
			.default(interaction);

		await interaction.reply({
			embeds: [embed],
		});
	},
	async autocomplete(client, interaction) {},
};
