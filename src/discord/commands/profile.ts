import { ButtonBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
	ActionRowBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	Client,
} from "discord.js";
import { Users } from "../../database/prisma.js";
import { Embed } from "../../common.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("profile")
			.setDescription("Access profile.")
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("Check another's profile!")
					.setRequired(false)
			),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		// Get the users data
		const userInput = interaction.options.getUser("user", false);
		let user = await Users.get({
			discordid: userInput?.id || interaction.user.id,
		});

		if (user) {
			user.posts = null;

			// Create an object of key-value pairs
			const userObject = Object.keys(user).reduce((acc, key) => {
				acc[key] = user[key as keyof typeof user];
				return acc;
			}, {} as Record<string, unknown>);

			// Create an array of field objects
			const data: {
				name: string;
				value: string;
				inline: boolean;
			}[] = Object.entries(userObject)
				.map(([key, value]) => {
					if (key === "posts") return;
					let newValue: string = String(value);

					if (key === "perms")
						newValue = `\`${String(value).replaceAll(",", ", ")}\``;
					if (
						newValue === null ||
						newValue.length === 0 ||
						newValue === ""
					)
						newValue = "NONE";
					return {
						name: key,
						value: newValue,
						inline: true,
					};
				})
				.filter((p) => p != undefined);

			// Create an array of buttons for the interaction response
			let buttons: ButtonBuilder[] = [
				new ButtonBuilder()
					.setCustomId("editprofile")
					.setLabel("Edit Profile")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("deleteprofile")
					.setLabel("Delete Profile")
					.setStyle(ButtonStyle.Danger),
			];

			// Disable edit and delete buttons if the user is not the owner of the profile
			if (interaction.user.id != user.discordid) {
				buttons = buttons.map((p) => {
					p.setDisabled(true);
					return p;
				});
			}

			// Create an ActionRow with the buttons
			let components = new ActionRowBuilder().addComponents(buttons);

			// Send the user data as an embed in the interaction's reply message
			await interaction.reply({
				embeds: [
					new Embed()
						.setTitle("Profile")
						.addFields(data)
						.setAuthor({
							name:
								userInput?.username ||
								interaction.user.username,
							iconURL:
								userInput?.avatarURL() ||
								interaction.user.avatarURL(),
						})
						.default(interaction),
				],
				components: [components as any],
			});
		} else {
			await interaction.reply({
				content:
					"Sorry, we couldn't find that user in our database. Please make sure they actually have an account with us.",
				ephemeral: true,
			});
		}
	},
	async autocomplete(client, interaction) {},
};
