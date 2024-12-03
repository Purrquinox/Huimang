import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { Embed } from "../../common.js";

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
							name: "Server Count",
							value: String(totalGuilds),
							inline: true,
						},
						{
							name: "Member Count",
							value: String(totalMembers),
							inline: true,
						},
						{
							name: "Shard Count",
							value: String(client.shard.count),
							inline: true,
						},
						{
							name: `Gateway Latency`,
							value: `${interaction.client.ws.ping}ms`,
							inline: true,
						},
						{
							name: `Roundtrip Latency`,
							value: `${interactionLatency}ms`,
							inline: true,
						}
					)
					.default(interaction),
			],
		});
	},
	async autocomplete(client, interaction) {},
};
