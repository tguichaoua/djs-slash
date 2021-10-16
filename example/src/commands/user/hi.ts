import { UserCommand } from 'djs-slash';

export default UserCommand.define(async (interaction, user) => {
    await interaction.reply({ content: `Hi, ${user}` });
});
