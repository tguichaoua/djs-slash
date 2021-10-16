import { ChoicesUtils, SlashCommand } from 'djs-slash';

type LanguageCode = 'fr' | 'en' | 'es';

const languageNames: Record<LanguageCode, string> = {
    fr: 'French',
    en: 'English',
    es: 'Spanish',
};

export default SlashCommand.define(
    'Set the language',
    {
        options: {
            language: {
                type: 'STRING',
                description: 'The language',
                required: true,
                choices: ChoicesUtils.valueNameRecord(languageNames),
            },
        },
    },
    async (interaction, { language }) => {
        // language: LanguageCode
        await interaction.reply({
            content: `Language set to \`${languageNames[language]}\`\n*This is only for the sake of example, the language is not actually changed.*`,
            ephemeral: true,
        });
    },
);
