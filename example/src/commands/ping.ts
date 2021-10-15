import { SlashCommand } from 'djs-slash';

export default SlashCommand.define("Reply with 'pong'", {}, async (interaction) => {
    await interaction.reply({ content: ':ping_pong: pong !', ephemeral: true });
});
