import { Constants } from 'discord.js';
import { SlashCommand } from 'djs-slash';

export default SlashCommand.define(
    'Send a hello message',
    {
        options: {
            where: {
                description: 'Where to post the message',
                type: 'CHANNEL',
                required: true,
                channelTypes: [Constants.ChannelTypes.GUILD_TEXT],
            },
        },
    },
    async (interaction, { where }) => {
        await where.send('Hello !');
        await interaction.reply({ content: 'Done', ephemeral: true });
    },
);
