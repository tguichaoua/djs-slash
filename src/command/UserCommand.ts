import { Constants, UserApplicationCommandData } from 'discord.js';
import { AppCommand } from './AppCommand';

export class UserCommand extends AppCommand {
    toApplicationCommandData(): UserApplicationCommandData {
        return {
            type: Constants.ApplicationCommandTypes.USER,
            name: this.name,
            defaultPermission: this.defaultPermission,
        };
    }
}
