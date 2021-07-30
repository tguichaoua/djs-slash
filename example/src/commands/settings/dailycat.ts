import { SlashCommand } from "djs-slash";

export default SlashCommand.define(
    "Enables or disables the daily cat image",
    {
        options: {
            enabled: {
                type: "BOOLEAN",
                description: "Either or not enable the daily cat image",
                required: true,
            },
        },
    },
    async (interaction, { enabled }) => {
        // enabled: boolean
        if (enabled) {
            await interaction.reply({ content: "Prepare yourself for your daily dose of cat :cat:", ephemeral: true });
        } else {
            await interaction.reply({ content: "Okay, not more cats :crying_cat_face:", ephemeral: true });
        }
    },
);
