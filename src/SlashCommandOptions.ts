import { SlashCommandOptionsType } from './SlashCommandOptionsType';
import {
    ApplicationCommandChannelOptionData,
    ApplicationCommandChoicesData,
    ApplicationCommandNonOptionsData,
    ApplicationCommandOptionType,
    Constants,
} from 'discord.js';
import { isArrayOf, isOptionnal, isRecord, isRecordOf, isTypeof, TypeGuard } from './utils/typeguard';
import { ApplicationCommandOptionTypes, ChannelTypes } from 'discord.js/typings/enums';

export interface Choice<T extends string | number> {
    readonly name: string;
    readonly value: T;
}

export type SlashCommandOptionsData = {
    readonly description: string;
    readonly required?: boolean;
} & (
    | {
          readonly type: Exclude<
              SlashCommandOptionsType,
              | 'STRING'
              | 'INTEGER'
              | 'NUMBER'
              | 'CHANNEL'
              | ApplicationCommandOptionTypes.STRING
              | ApplicationCommandOptionTypes.INTEGER
              | ApplicationCommandOptionTypes.NUMBER
              | ApplicationCommandOptionTypes.CHANNEL
          >;
          readonly choices?: never;
          readonly channelTypes?: never;
      }
    | {
          readonly type: 'STRING' | ApplicationCommandOptionTypes.STRING;
          readonly choices?: ReadonlyArray<Choice<string>>;
          readonly channelTypes?: never;
      }
    | {
          readonly type:
              | 'INTEGER'
              | 'NUMBER'
              | ApplicationCommandOptionTypes.INTEGER
              | ApplicationCommandOptionTypes.NUMBER;
          readonly choices?: ReadonlyArray<Choice<number>>;
          readonly channelTypes?: never;
      }
    | {
          readonly type: 'CHANNEL' | ApplicationCommandOptionTypes.CHANNEL;
          readonly channelTypes?: readonly ChannelTypes[];
          readonly choices?: never;
      }
);

export type SlashCommandOptions = Readonly<Record<string, SlashCommandOptionsData>>;

export function slashCommandOptionsToApplicationCommandOptionDataArray(
    options: SlashCommandOptions,
): (ApplicationCommandNonOptionsData | ApplicationCommandChannelOptionData | ApplicationCommandChoicesData)[] {
    return Object.entries(options).map(([name, o]) => {
        return {
            type: o.type,
            name,
            description: o.description,
            required: o.required,
            choices: o.choices && [...o.choices],
            channel_types: o.channelTypes && [...o.channelTypes],
        } as ApplicationCommandNonOptionsData | ApplicationCommandChannelOptionData | ApplicationCommandChoicesData;
    });
}

export const isChoice = isRecord({
    name: isTypeof('string'),
    value: isTypeof('string', 'number'),
}) as TypeGuard<Choice<string | number>>;

export const isSlashCommandOptionsData = isRecord({
    type: (o): o is ApplicationCommandOptionType =>
        Constants.ApplicationCommandOptionTypes[o as ApplicationCommandOptionType] !== undefined,
    description: isTypeof('string'),
    required: isTypeof('boolean', 'undefined'),
    choices: isOptionnal(isArrayOf(isChoice)),
}) as TypeGuard<SlashCommandOptionsData>;

export const isSlashCommandOptions = isRecordOf(isSlashCommandOptionsData) as TypeGuard<SlashCommandOptions>;
