import fetch from "node-fetch";
import { MessageAttachment } from "discord.js";
import { ChoicesUtils, SlashCommand } from "djs-slash";

export default SlashCommand.define(
    "Gets an image of a animal",
    {
        options: {
            kind: {
                type: "STRING",
                description: "The kind of animal",
                required: true,
                choices: ChoicesUtils.nameValueRecord({
                    cat: "https://api.thecatapi.com/v1/images/search",
                    dog: "https://api.thedogapi.com/v1/images/search",
                }),
            },
        },
    },
    async (interaction, { kind }) => {
        // kind: string
        await interaction.defer();
        try {
            const [{ url }] = await fetch(kind).then((res) => res.json());
            if (typeof url === "string") {
                await interaction.editReply({ files: [new MessageAttachment(url)] });
            } else {
                await interaction.editReply({ content: "An error happen !" });
            }
        } catch (e) {
            console.error(e);
            await interaction.editReply({ content: "An error happen !" });
        }
    },
);
