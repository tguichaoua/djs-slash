import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js';
import { SlashCommandCallback } from '../callbacks';
import { SlashCommandData } from '../data/SlashCommandData';
import { SlashCommandOptions } from '../SlashCommandOptions';
import { GroupSlashCommand } from './GroupSlashCommand';
import { AppCommand } from './AppCommand';

export abstract class SlashCommand extends AppCommand {
    constructor(name: string, public readonly description: string, defaultPermission: boolean | undefined) {
        super(name, defaultPermission);
    }

    /** @internal */
    abstract execute(interaction: CommandInteraction): Promise<void>;

    abstract toApplicationCommandData(): ChatInputApplicationCommandData;

    isGroupCommand(): this is GroupSlashCommand {
        return this instanceof GroupSlashCommand;
    }

    static define<Opt extends SlashCommandOptions = never>(
        description: string,
        options: { defaultPermission?: boolean; options?: Opt },
        callback: SlashCommandCallback<Opt>,
    ): SlashCommandData {
        return {
            description,
            options: options.options ?? {},
            defaultPermission: options?.defaultPermission,
            callback,
        };
    }
}
