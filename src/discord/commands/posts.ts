import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Embed, platforms } from "../../common.js";
import { BlogPosts } from "../../database/prisma.js";
import { Service } from "../../database/types/prismaTypes.js";
import paginationEmbed from "../modules/pagination.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("posts")
			.setDescription("Access all Huimang Blog Posts.")
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
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		// Get all posts
		let posts = await BlogPosts.GetAllPosts();
		posts = posts.filter(
			(p) =>
				p.service ===
				(interaction.options.getString("platform") as Service)
		);

		if (posts.length != 0) {
			// Send the posts data as an embed in the interaction's reply message
			const pages = posts.map((i) => {
				return new Embed()
					.setTitle(`${i.title} | [${i.flairs.join(", ")}]`)
					.setDescription(i.content)
					.setAuthor({
						name: i.author.username,
						iconURL: i.author.avatar,
					})
					.default(interaction);
			});

			await paginationEmbed(interaction, pages, []);
		} else {
			await interaction.reply({
				content: "No posts found for the specified platform.",
				ephemeral: true,
			});
		}
	},
};
