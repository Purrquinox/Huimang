import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("leaveofabsence")
			.setDescription("Access Leave of Absence(s) database.")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Add a new Leave of Absence.")
					.addStringOption((option) =>
						option
							.setName("reason")
							.setDescription(
								"The reason for the Leave of Absence."
							)
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName("startDate")
							.setDescription(
								"The start date of the Leave of Absence."
							)
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName("endDate")
							.setDescription(
								"The end date of the Leave of Absence."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("remove")
					.setDescription("Remove a Leave of Absence.")
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the Leave of Absence to remove."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("list")
					.setDescription("List all Leave of Absence.")
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("view")
					.setDescription(
						"View details of a specific Leave of Absence."
					)
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the Leave of Absence to view."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("edit")
					.setDescription("Edit a Leave of Absence.")
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the Leave of Absence to edit."
							)
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName("reason")
							.setDescription(
								"The reason for the Leave of Absence."
							)
					)
					.addStringOption((option) =>
						option
							.setName("startDate")
							.setDescription(
								"The start date of the Leave of Absence."
							)
					)
					.addStringOption((option) =>
						option
							.setName("endDate")
							.setDescription(
								"The end date of the Leave of Absence."
							)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("approve")
					.setDescription("Approve a Leave of Absence.")
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the Leave of Absence to approve."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("deny")
					.setDescription("Deny a Leave of Absence.")
					.addIntegerOption((option) =>
						option
							.setName("id")
							.setDescription(
								"The ID of the Leave of Absence to deny."
							)
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("pending")
					.setDescription("List all pending Leave of Absence.")
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("approved")
					.setDescription("List all approved Leave of Absence.")
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("denied")
					.setDescription("List all denied Leave of Absence.")
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
