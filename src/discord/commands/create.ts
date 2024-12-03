import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Users, BlogPosts } from "../../database/prisma.js";
import { Service } from "../../database/types/prismaTypes.js";
import { randomUUID } from "crypto";
import { platforms } from "../../common.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("create_post")
			.setDescription("Create an Huimang Blog Post.")
			.addStringOption((option) =>
				option
					.setName("title")
					.setDescription("What would you like to call this post?")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("content")
					.setDescription("What is the content for this post?")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("flairs")
					.setDescription(
						"What flairs would you like to be added to this post? (comma-seperated)"
					)
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("platform")
					.setDescription("What platform is this to be posted on?")
					.setRequired(true)
					.addChoices(
						platforms.map((p) => {
							return { name: p, value: p.toUpperCase() };
						})
					)
			),
		category: "entities",
		accountRequired: true,
		permissionRequired: "content.add",
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

		// Save the new post to the database
		const postData = {
			id: String(randomUUID()),
			authorId: user.id,
			service: interaction.options.getString("platform") as Service,
			title: interaction.options.getString("title"),
			content: interaction.options.getString("content"),
			flairs: interaction.options.getString("flairs").split(","),
		};
		const post = await BlogPosts.createPost(postData);

		if (post) {
			// Send the post data as an embed in the interaction's reply message
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Post Created")
						.setURL("https://huimang.purrquinox.com/")
						.setThumbnail("https://selectdev.me/logo.png")
						.setColor("Orange")
						.setDescription(JSON.stringify(postData))
						.setFooter({
							iconURL: interaction.user.displayAvatarURL(),
							text: `Executed by ${interaction.user.username}.`,
						}),
				],
				fetchReply: true,
			});
		} else {
			// Send an error message if the post creation failed
			await interaction.reply({
				content: "Failed to create the post. Please try again.",
				ephemeral: true,
			});
		}
	},
};
