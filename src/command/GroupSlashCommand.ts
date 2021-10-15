import {
    ApplicationCommandSubCommandData,
    ApplicationCommandSubGroupData,
    ChatInputApplicationCommandData,
    CommandInteraction,
    Constants,
} from 'discord.js';
import { SingleSlashCommand } from './SingleSlashCommand';
import { SlashCommand } from './SlashCommand';

export interface SubCommandGroup {
    readonly name: string;
    readonly description: string;
    readonly defaultPermission: boolean | undefined;
    readonly subCommands: ReadonlyMap<string, SingleSlashCommand>;
}

export class GroupSlashCommand extends SlashCommand {
    constructor(
        name: string,
        description: string,
        defaultPermission: boolean | undefined,
        public readonly subCommands: ReadonlyMap<string, SingleSlashCommand>,
        public readonly groups: ReadonlyMap<string, SubCommandGroup>,
    ) {
        super(name, description, defaultPermission);
    }

    /** @internal */
    async execute(interaction: CommandInteraction): Promise<void> {
        const subCommandName = interaction.options.getSubcommand();
        const groupName = interaction.options.getSubcommandGroup(false);

        const executable =
            groupName !== null
                ? this.groups.get(groupName)?.subCommands.get(subCommandName)
                : this.subCommands.get(subCommandName);
        if (executable === undefined) throw new Error('No executable');
        await executable.execute(interaction);
    }

    toApplicationCommandData(): ChatInputApplicationCommandData {
        const subCommands: ApplicationCommandSubCommandData[] = Array.from(this.subCommands.values()).map((command) =>
            command.toSubCommandData(),
        );

        const groupCommands: ApplicationCommandSubGroupData[] = Array.from(this.groups.values()).map((group) => {
            return {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
                name: group.name,
                description: group.description,
                options: Array.from(group.subCommands.values()).map((command) => command.toSubCommandData()),
            };
        });

        return {
            type: Constants.ApplicationCommandTypes.CHAT_INPUT,
            name: this.name,
            description: this.description,
            defaultPermission: this.defaultPermission,
            options: [...subCommands, ...groupCommands],
        };
    }
}
