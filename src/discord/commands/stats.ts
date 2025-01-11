import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Embed } from "../../common.js";
import { simpleGit } from "simple-git";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("stats")
			.setDescription("Check the bot's statistics"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(
		client: Client,
		interaction: ChatInputCommandInteraction,
		otherData: any
	) {
		// Fetch local git commit information
		const git = simpleGit();
		const log = await git.log();
		const latestCommit = log.latest;

		// Send original reply
		const reply = await interaction.reply({
			embeds: [
				new Embed()
					.setTitle("Pinging!")
					.setDescription(
						`Checking Gateway Latency & Roundtrip Latency...`
					)
					.default(interaction),
			],
			fetchReply: true,
		});

		// Round up interaction latency
		const interactionLatency = Math.round(
			reply.createdTimestamp - interaction.createdTimestamp
		);

		// Client Statistics
		// @ts-ignore
		let totalGuilds: number = (
			await client.shard.fetchClientValues("guilds.cache.size")
		)
			//@ts-ignore
			.reduce((acc, guildCount) => acc + guildCount, 0);

		let totalMembers: number = (
			await client.shard.broadcastEval((c) =>
				c.guilds.cache.reduce(
					(acc, guild) => acc + guild.memberCount,
					0
				)
			)
		).reduce((acc, memberCount) => acc + memberCount, 0);

		// Edit original reply
		reply.edit({
			embeds: [
				new Embed()
					.setTitle("Statistics!")
					.setDescription("I hope it looks good :eyes:")
					.addFields(
						{
							name: `Gateway Latency:`,
							value: `${interaction.client.ws.ping}ms`,
							inline: true,
						},
						{
							name: `Roundtrip Latency:`,
							value: `${interactionLatency}ms`,
							inline: true,
						},
						{
							name: "Git Commit:",
							value: `${latestCommit.message} - ${latestCommit.author_name} | ${latestCommit.hash}`,
							inline: true,
						},
						{
							name: "Server Count:",
							value: `${totalGuilds} server(s)`,
							inline: true,
						},
						{
							name: "Member Count:",
							value: `${totalMembers} member(s)`,
							inline: true,
						},
						{
							name: "Shard Count:",
							value: `${client.shard.count} shard(s)`,
							inline: true,
						}
					)
					.default(interaction),
			],
		});
	},
	async autocomplete(client, interaction) {},
};
