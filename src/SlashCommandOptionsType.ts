import { ApplicationCommandOptionData, CommandInteractionOption } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

export type SlashCommandOptionsType = Exclude<
    ApplicationCommandOptionData["type"],
    | "SUB_COMMAND"
    | "SUB_COMMAND_GROUP"
    | ApplicationCommandOptionTypes.SUB_COMMAND
    | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
>;

export type ResolveSlashCommandOptionsType<T extends SlashCommandOptionsType> = T extends
    | "STRING"
    | ApplicationCommandOptionTypes.STRING
    ? string
    : T extends "INTEGER" | "NUMBER" | ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER
    ? number
    : T extends "BOOLEAN" | ApplicationCommandOptionTypes.BOOLEAN
    ? boolean
    : T extends "USER" | ApplicationCommandOptionTypes.USER
    ? NonNullable<CommandInteractionOption["user"]>
    : T extends "CHANNEL" | ApplicationCommandOptionTypes.CHANNEL
    ? NonNullable<CommandInteractionOption["channel"]>
    : T extends "ROLE" | ApplicationCommandOptionTypes.ROLE
    ? NonNullable<CommandInteractionOption["role"]>
    : T extends "MENTIONABLE" | ApplicationCommandOptionTypes.MENTIONABLE
    ? NonNullable<
          CommandInteractionOption["member"] | CommandInteractionOption["user"] | CommandInteractionOption["role"]
      >
    : never;
