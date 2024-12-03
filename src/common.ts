// Packages
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

// Huimang Platforms
const platforms = ["Sparkyflight", "AntiRaid", "Selectdev"];

// Extend EmbedBuilder
class Embed extends EmbedBuilder {
	default(interaction: ChatInputCommandInteraction) {
		this.setURL("https://huimang.purrquinox.com/")
			.setThumbnail("https://selectdev.me/logo.png")
			.setColor("Random")
			.setTimestamp()
			.setFooter({
				iconURL: interaction.user.displayAvatarURL(),
				text: `Executed by ${interaction.user.username}.`,
			});
		return this;
	}
}

// Export everything
export { Embed, platforms };
