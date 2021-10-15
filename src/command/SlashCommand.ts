import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { SlashCommandCallback } from '../SlashCommandCallback';
import { SlashCommandData } from '../data/SlashCommandData';
import { SlashCommandOptions } from '../SlashCommandOptions';
import { GroupSlashCommand } from './GroupSlashCommand';

export abstract class SlashCommand {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly defaultPermission: boolean | undefined,
    ) {}

    /** @internal */
    abstract execute(interaction: CommandInteraction): Promise<void>;

    abstract toApplicationCommandData(): ApplicationCommandData;

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
