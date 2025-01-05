import {
	ButtonBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
} from "@discordjs/builders";
import {
	ActionRowBuilder,
	APIButtonComponentWithCustomId,
	ButtonStyle,
	ChatInputCommandInteraction,
	Client,
	TextInputStyle,
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
					const hiddenKeys = [
						"posts",
						"infractions",
						"issued_infractions",
						"transactions",
						"leave_of_absences",
					];
					if (hiddenKeys.includes(key)) return;

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
			const msg = await interaction.reply({
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
				fetchReply: true,
			});

			const filter = (i) => {
				if (
					buttons.find(
						(p) =>
							(
								p.toJSON() as Partial<APIButtonComponentWithCustomId>
							).custom_id === i.customId
					)
				)
					return true;
				else return false;
			};

			const collector = msg.createMessageComponentCollector({
				filter,
				time: 120000,
			});

			collector.on("collect", async (i) => {
				const button = buttons.find(
					(p) => (p.toJSON() as any).custom_id === i.customId
				);

				if (button) {
					if (i.customId === "editprofile") {
						const modal = new ModalBuilder()
							.setTitle("Edit Profile")
							.setCustomId("editprofile");
						const name = new TextInputBuilder()
							.setLabel("Username")
							.setCustomId("username")
							.setRequired(true)
							.setPlaceholder("What do you prefer to be called?")
							.setStyle(TextInputStyle.Short)
							.setValue(user.username);
						const bio = new TextInputBuilder()
							.setLabel("Biography")
							.setCustomId("bio")
							.setRequired(true)
							.setPlaceholder("Describe yourself in a few words.")
							.setStyle(TextInputStyle.Paragraph)
							.setValue(user.bio);
						const avatar = new TextInputBuilder()
							.setLabel("Avatar URL")
							.setCustomId("avatar")
							.setRequired(true)
							.setPlaceholder("Provide a link to your avatar.")
							.setStyle(TextInputStyle.Short)
							.setValue(user.avatar);

						modal.addComponents(
							new ActionRowBuilder().addComponents(name) as any,
							new ActionRowBuilder().addComponents(bio) as any,
							new ActionRowBuilder().addComponents(avatar) as any
						);
						i.showModal(modal);
						collector.stop();
					} else if (i.customId === "deleteprofile") {
						const d = await i.reply({
							embeds: [
								new Embed()
									.setTitle(
										"⚠️ Account Deletion Confirmation ⚠️"
									)
									.setDescription(
										"We understand that you want to delete your account, and we want to make sure you're fully informed before proceeding. By confirming below, your account will be permanently deleted. This action is **irreversible**, and once completed, Purrquinox/AntiRaid staff **CANNOT** undo or recover your account."
									)
									.addFields({
										name: "Important Information:",
										value: "- All purchases and items associated with your account will be permanently lost. No refunds will be issued, and any progress made will be gone forever.\n- You will no longer have access to any services, features, or content tied to your account.\n- This action is **irreversible**",
									})
									.default(interaction),
							],
							components: [
								new ActionRowBuilder().addComponents([
									new ButtonBuilder()
										.setCustomId("confirm")
										.setLabel("Delete")
										.setStyle(ButtonStyle.Danger),
									new ButtonBuilder()
										.setCustomId("cancel")
										.setLabel("Cancel")
										.setStyle(ButtonStyle.Primary),
								]) as any,
							],
							fetchReply: true,
						});

						const btncollect = d.createMessageComponentCollector({
							filter: (i) => {
								if (["confirm", "cancel"].includes(i.customId))
									return true;
								else return false;
							},
							time: 120000,
						});

						btncollect.on("collect", async (a) => {
							if (a.customId === "confirm") {
								await Users.delete(user.id);
								await a.reply({
									content:
										"Confirmed. This account has been permanently deleted.",
									ephemeral: true,
								});
								btncollect.stop();
							} else {
								await a.reply({
									content:
										"Okay! Account deletion has been cancelled.",
									ephemeral: true,
								});
								btncollect.stop();
							}
						});
					} else
						i.reply({
							content: `This button currently has no functionality, and is currently in progress of development.\n\`\`\`js\n${JSON.stringify(
								button
							)}\n\`\`\`\`\`\`js\n${JSON.stringify(
								user
							)}\n\`\`\``,
						});

					collector.stop();
				} else
					i.reply({
						content: "Invalid interaction.",
					});
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
