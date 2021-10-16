import { Constants, ContextMenuInteraction, UserApplicationCommandData } from 'discord.js';
import { UserCommandData } from '../data/UserCommandData';
import { UserCommandCallback } from '../UserCommandCallback';
import { AppCommand } from './AppCommand';

export class UserCommand extends AppCommand {
    private readonly callback: UserCommandCallback;

    constructor(name: string, data: UserCommandData) {
        super(name, data.defaultPermission);
        this.callback = data.callback;
    }

    /** @internal */
    async execute(interaction: ContextMenuInteraction): Promise<void> {
        await this.callback(interaction, interaction.options.getUser('user', true));
    }

    toApplicationCommandData(): UserApplicationCommandData {
        return {
            type: Constants.ApplicationCommandTypes.USER,
            name: this.name,
            defaultPermission: this.defaultPermission,
        };
    }
}
