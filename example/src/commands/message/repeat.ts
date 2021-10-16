import { MessageCommand } from 'djs-slash';

export default MessageCommand.define(async (interaction, message) => {
    await interaction.reply({ content: message.content });
});
