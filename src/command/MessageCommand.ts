import { Constants, ContextMenuInteraction, MessageApplicationCommandData } from 'discord.js';
import { MessageCommandData } from '../data';
import { MessageCommandCallback } from '../callbacks';
import { AppCommand } from './AppCommand';

export class MessageCommand extends AppCommand {
    private readonly callback: MessageCommandCallback;

    constructor(name: string, data: MessageCommandData) {
        super(name, data.defaultPermission);
        this.callback = data.callback;
    }

    /** @internal */
    async execute(interaction: ContextMenuInteraction): Promise<void> {
        await this.callback(interaction, interaction.options.getMessage('message', true));
    }

    toApplicationCommandData(): MessageApplicationCommandData {
        return {
            type: Constants.ApplicationCommandTypes.MESSAGE,
            name: this.name,
            defaultPermission: this.defaultPermission,
        };
    }

    static define(callback: MessageCommandCallback): MessageCommandData;
    static define(
        options: { readonly defaultPermission?: boolean },
        callback: MessageCommandCallback,
    ): MessageCommandData;
    static define(
        a: { readonly defaultPermission?: boolean } | MessageCommandCallback,
        b?: MessageCommandCallback,
    ): MessageCommandData {
        return typeof a === 'function'
            ? { callback: a, defaultPermission: undefined }
            : { callback: b!, defaultPermission: a?.defaultPermission }; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
}
