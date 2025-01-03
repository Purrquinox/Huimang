import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("infractions")
			.setDescription("Access infractions database.")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Add an infraction to a user.")
					.addUserOption((option) =>
						option
							.setName("user")
							.setDescription("The user to add an infraction to.")
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName("reason")
							.setDescription("The reason for the infraction.")
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName("duration")
							.setDescription("The duration of the infraction.")
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("remove")
					.setDescription("Remove an infraction from a user.")
					.addUserOption((option) =>
						option
							.setName("user")
							.setDescription(
								"The user to remove an infraction from."
							)
							.setRequired(true)
					)
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the infraction to remove."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("list")
					.setDescription("List infractions for a user.")
					.addUserOption((option) =>
						option
							.setName("user")
							.setDescription("The user to list infractions for.")
							.setRequired(true)
					)
			),
		category: "staff",
		accountRequired: true,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {},
	async autocomplete(client, interaction) {},
};
