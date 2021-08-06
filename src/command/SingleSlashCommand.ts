import {
    ApplicationCommandData,
    ApplicationCommandOptionData,
    CommandInteraction,
    CommandInteractionOption,
    Constants,
} from "discord.js";
import { SlashCommandCallback } from "../SlashCommandCallback";
import { SlashCommandData } from "../data/SlashCommandData";
import { slashCommandOptionsToApplicationCommandOptionDataArray } from "../SlashCommandOptions";
import { SlashCommandOptionsType } from "../SlashCommandOptionsType";
import { SlashCommand } from "./SlashCommand";

export class SingleSlashCommand extends SlashCommand {
    private readonly options: (ApplicationCommandOptionData & { type: SlashCommandOptionsType })[];
    private readonly callback: SlashCommandCallback;

    constructor(name: string, data: SlashCommandData) {
        super(name, data.description, data.defaultPermission);
        this.options = slashCommandOptionsToApplicationCommandOptionDataArray(data.options);
        this.callback = data.callback;
    }

    /** @internal */
    async execute(interaction: CommandInteraction): Promise<void> {
        const args = Object.fromEntries(
            this.options.map((o) => {
                const opt = interaction.options.get(o.name);
                const value = opt === null ? null : resolveOption(o.type, opt);
                return [o.name, value] as const;
            }) ?? [],
        );
        await this.callback(interaction, args as never);
    }

    toApplicationCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultPermission: this.defaultPermission,
        };
    }
}

function resolveOption(type: SlashCommandOptionsType, opt: CommandInteractionOption): unknown {
    switch (type) {
        case "BOOLEAN":
        case "INTEGER":
        case "STRING":
        case "NUMBER":
        case Constants.ApplicationCommandOptionTypes.BOOLEAN:
        case Constants.ApplicationCommandOptionTypes.INTEGER:
        case Constants.ApplicationCommandOptionTypes.STRING:
        case Constants.ApplicationCommandOptionTypes.NUMBER:
            return opt.value;
        case "CHANNEL":
        case Constants.ApplicationCommandOptionTypes.CHANNEL:
            return opt.channel;
        case "ROLE":
        case Constants.ApplicationCommandOptionTypes.ROLE:
            return opt.role;
        case "USER":
        case Constants.ApplicationCommandOptionTypes.USER:
            return opt.user;
        case "MENTIONABLE":
        case Constants.ApplicationCommandOptionTypes.MENTIONABLE:
            return opt.member ?? opt.user ?? opt.role;
    }
}
