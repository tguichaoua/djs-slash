import { SlashCommandOptionsType } from "./SlashCommandOptionsType";
import { ApplicationCommandOptionData, ApplicationCommandOptionType, Constants } from "discord.js";
import { isArrayOf, isOptionnal, isRecord, isRecordOf, isTypeof, TypeGuard } from "./utils/typeguard";

export interface Choice<T extends string | number> {
    readonly name: string;
    readonly value: T;
}

export type SlashCommandOptionsData = {
    readonly description: string;
    readonly required?: boolean;
} & (
    | {
          readonly type: Exclude<SlashCommandOptionsType, "STRING" | "INTEGER" | "NUMBER">;
          readonly choices?: never;
      }
    | {
          readonly type: "STRING";
          readonly choices?: ReadonlyArray<Choice<string>>;
      }
    | {
          readonly type: "INTEGER" | "NUMBER";
          readonly choices?: ReadonlyArray<Choice<number>>;
      }
);

export type SlashCommandOptions = Readonly<Record<string, SlashCommandOptionsData>>;

export function slashCommandOptionsToApplicationCommandOptionDataArray(
    options: SlashCommandOptions,
): (ApplicationCommandOptionData & { type: SlashCommandOptionsType })[] {
    return Object.entries(options).map(([name, o]) => {
        return {
            type: o.type,
            name,
            description: o.description,
            required: o.required,
            choices: o.choices && [...o.choices],
        };
    });
}

export const isChoice = isRecord({
    name: isTypeof("string"),
    value: isTypeof("string", "number"),
}) as TypeGuard<Choice<string | number>>;

export const isSlashCommandOptionsData = isRecord({
    type: (o): o is ApplicationCommandOptionType =>
        Constants.ApplicationCommandOptionTypes[o as ApplicationCommandOptionType] !== undefined,
    description: isTypeof("string"),
    required: isTypeof("boolean", "undefined"),
    choices: isOptionnal(isArrayOf(isChoice)),
}) as TypeGuard<SlashCommandOptionsData>;

export const isSlashCommandOptions = isRecordOf(isSlashCommandOptionsData) as TypeGuard<SlashCommandOptions>;
