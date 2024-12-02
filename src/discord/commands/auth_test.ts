import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Users } from "../../database/prisma.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("auth_test")
			.setDescription("Test usage of authorization and purrperms."),
		category: "general",
		accountRequired: true,
		permissionRequired: "user.read",
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		// Get the users data
		let user = await Users.get({
			discordid: interaction.user.id,
		});
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

		// Send the user data as an embed in the interaction's reply message
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("User Data")
					.setURL("https://huimang.purrquinox.com/")
					.setThumbnail("https://selectdev.me/logo.png")
					.setColor("Orange")
					.addFields(data)
					.setFooter({
						iconURL: interaction.user.displayAvatarURL(),
						text: `Executed by ${interaction.user.username}.`,
					}),
			],
			fetchReply: true,
		});
	},
	async autocomplete(client, interaction) {},
};
