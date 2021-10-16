import { ApplicationCommandData } from 'discord.js';

/**
 * Base class of user defined application command.
 */
export abstract class AppCommand {
    constructor(public readonly name: string, public readonly defaultPermission: boolean | undefined) {}

    abstract toApplicationCommandData(): ApplicationCommandData;
}
