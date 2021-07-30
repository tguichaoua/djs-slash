import { ApplicationCommandOptionType, CommandInteractionOption } from "discord.js";

export type SlashCommandOptionsType = Exclude<ApplicationCommandOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">;

export type ResolveSlashCommandOptionsType<T extends SlashCommandOptionsType> = T extends "STRING"
    ? string
    : T extends "INTEGER"
    ? number
    : T extends "NUMBER"
    ? number
    : T extends "BOOLEAN"
    ? boolean
    : T extends "USER"
    ? NonNullable<CommandInteractionOption["user"]>
    : T extends "CHANNEL"
    ? NonNullable<CommandInteractionOption["channel"]>
    : T extends "ROLE"
    ? NonNullable<CommandInteractionOption["role"]>
    : T extends "MENTIONABLE"
    ? NonNullable<
          CommandInteractionOption["member"] | CommandInteractionOption["user"] | CommandInteractionOption["role"]
      >
    : never;
