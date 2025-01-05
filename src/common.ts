// Packages
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Message,
	OmitPartialGroupDMChannel,
} from "discord.js";

// Huimang Platforms
const platforms = ["Sparkyflight", "AntiRaid", "Selectdev"];

// Extend EmbedBuilder
class Embed extends EmbedBuilder {
	default(interaction: ChatInputCommandInteraction) {
		this.setURL("https://purrquinox.com/")
			.setColor("Random")
			.setTimestamp()
			.setFooter({
				iconURL: interaction.user.displayAvatarURL(),
				text: `Executed by ${interaction.user.username}.`,
			});
		return this;
	}

	msgdefault(message: OmitPartialGroupDMChannel<Message<boolean>>) {
		this.setURL("https://purrquinox.com/")
			.setColor("Random")
			.setTimestamp()
			.setFooter({
				iconURL: message.member.user.displayAvatarURL(),
				text: `Executed by ${message.member.user.username}.`,
			});
		return this;
	}
}

// WIP
class ServiceError extends Error {
	interaction: ChatInputCommandInteraction;
	context: Record<string, any>;

	/**
	 * @param message - The error message.
	 * @param interaction - The interaction context
	 * @param context - Additional context about the error.
	 */
	constructor(
		message: string,
		interaction: ChatInputCommandInteraction,
		context: Record<string, any> = {}
	) {
		super(message);
		this.name = "ServiceError";
		this.interaction = interaction;
		this.context = context;

		// Ensures the correct prototype is used (important for extending Error in TypeScript)
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

// Export everything
export { Embed, ServiceError, platforms };
