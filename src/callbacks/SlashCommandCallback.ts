import { CommandInteraction } from 'discord.js';
import { SlashCommandOptions } from '../SlashCommandOptions';
import { ResolveSlashCommandOptionsType } from '../SlashCommandOptionsType';

export type SlashCommandCallback<Opt extends SlashCommandOptions = never> = (
    interaction: CommandInteraction,
    options: {
        [K in keyof Opt]:
            | AelseB<
                  NonNullable<Opt[K]['choices']>[number]['value'],
                  ResolveSlashCommandOptionsType<Opt[K]['type'], Opt[K]['channelTypes']>
              >
            | (Opt[K]['required'] extends true ? never : null);
    },
) => void | Promise<void>;

type AelseB<A, B> = unknown extends A ? B : A;
