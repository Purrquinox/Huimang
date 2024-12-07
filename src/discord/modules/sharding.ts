// Packages
import { ShardingManager } from "discord.js";
import { REST } from "@discordjs/rest";
import { debug, success } from "../../logger.js";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";

// Configure dotenv
dotenv.config();

// Initalize REST
const rest = new REST({
	version: "10",
}).setToken(process.env.DISCORD_TOKEN as string);

// Get files from directory
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

// Slash Commands
let commands: any = [];
const commandFiles = getFilesInDirectory("./dist/discord/commands").filter(
	(file) => file.endsWith(".js")
);

for (const file of commandFiles) {
	import(`../../../${file}`)
		.then((module) => {
			const i: any = module.default;
			commands.push(i.data.meta.toJSON());
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

setTimeout(() => {
	rest.put(
		Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
		{
			body: commands,
		}
	)
		.then((p: any) => {
			const commandsDeployed = p.map((p) => p.name);
			success(
				"Discord Interaction Deployment",
				`Deployed ${commandsDeployed.join(", ")}`
			);
		})
		.catch(console.error);
}, 3000);

// Sharding Manager
const manager = new ShardingManager("./dist/discord/discord.js", {
	token: process.env.DISCORD_TOKEN,
});

// Sharding Manager Events
manager.on("shardCreate", (shard) =>
	debug(`Shard ${shard.id}`, `Launched shard.`)
);

// Spawn Shards
manager.spawn();
