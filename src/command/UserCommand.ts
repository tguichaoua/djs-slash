import { Constants, ContextMenuInteraction, UserApplicationCommandData } from 'discord.js';
import { UserCommandData } from '../data';
import { UserCommandCallback } from '../callbacks';
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

    static define(callback: UserCommandCallback): UserCommandData;
    static define(options: { readonly defaultPermission?: boolean }, callback: UserCommandCallback): UserCommandData;
    static define(
        a: { readonly defaultPermission?: boolean } | UserCommandCallback,
        b?: UserCommandCallback,
    ): UserCommandData {
        return typeof a === 'function'
            ? { callback: a, defaultPermission: undefined }
            : { callback: b!, defaultPermission: a?.defaultPermission }; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
}
