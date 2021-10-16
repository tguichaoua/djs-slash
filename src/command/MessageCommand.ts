import { Constants, MessageApplicationCommandData } from 'discord.js';
import { AppCommand } from './AppCommand';

export class MessageCommand extends AppCommand {
    toApplicationCommandData(): MessageApplicationCommandData {
        return {
            type: Constants.ApplicationCommandTypes.MESSAGE,
            name: this.name,
            defaultPermission: this.defaultPermission,
        };
    }
}
