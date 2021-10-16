import { Client, Intents, Snowflake } from 'discord.js';
import { SlashCommandManager } from 'djs-slash';
import { token, guildId } from './config.json';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = SlashCommandManager.create();

client.once('ready', async (client) => {
    const guild = await client.guilds.fetch(guildId as Snowflake);
    await guild.commands.set(commands.toApplicationCommandData());
});

client.on('interactionCreate', async (interaction) => {
    interaction.isContextMenu;
    await commands.execute(interaction);
});

(async () => {
    await client.login(token);
})();
