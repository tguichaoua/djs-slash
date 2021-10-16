import {
    ApplicationCommandOptionData,
    CategoryChannel,
    CommandInteractionOption,
    DMChannel,
    NewsChannel,
    PartialGroupDMChannel,
    StageChannel,
    StoreChannel,
    TextChannel,
    ThreadChannel,
    VoiceChannel,
} from 'discord.js';
import { ApplicationCommandOptionTypes, ChannelTypes } from 'discord.js/typings/enums';

export type SlashCommandOptionsType = Exclude<
    ApplicationCommandOptionData['type'],
    | 'SUB_COMMAND'
    | 'SUB_COMMAND_GROUP'
    | ApplicationCommandOptionTypes.SUB_COMMAND
    | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
>;

export type ResolveSlashCommandOptionsType<
    T extends SlashCommandOptionsType,
    ChannelTs extends readonly ChannelTypes[] | undefined,
> = T extends 'STRING' | ApplicationCommandOptionTypes.STRING
    ? string
    : T extends 'INTEGER' | 'NUMBER' | ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER
    ? number
    : T extends 'BOOLEAN' | ApplicationCommandOptionTypes.BOOLEAN
    ? boolean
    : T extends 'USER' | ApplicationCommandOptionTypes.USER
    ? NonNullable<CommandInteractionOption['user']>
    : T extends 'CHANNEL' | ApplicationCommandOptionTypes.CHANNEL
    ? ChannelTs extends readonly ChannelTypes[]
        ? ResolveChannelType<ChannelTs[number]>
        : NonNullable<CommandInteractionOption['channel']>
    : T extends 'ROLE' | ApplicationCommandOptionTypes.ROLE
    ? NonNullable<CommandInteractionOption['role']>
    : T extends 'MENTIONABLE' | ApplicationCommandOptionTypes.MENTIONABLE
    ? NonNullable<
          CommandInteractionOption['member'] | CommandInteractionOption['user'] | CommandInteractionOption['role']
      >
    : never;

type ResolveChannelType<T extends ChannelTypes> = T extends ChannelTypes.DM
    ? DMChannel
    : T extends ChannelTypes.GROUP_DM
    ? PartialGroupDMChannel
    : T extends ChannelTypes.GUILD_CATEGORY
    ? CategoryChannel
    : T extends ChannelTypes.GUILD_NEWS
    ? NewsChannel
    : T extends ChannelTypes.GUILD_NEWS_THREAD
    ? ThreadChannel
    : T extends ChannelTypes.GUILD_PRIVATE_THREAD
    ? ThreadChannel
    : T extends ChannelTypes.GUILD_PUBLIC_THREAD
    ? ThreadChannel
    : T extends ChannelTypes.GUILD_STAGE_VOICE
    ? StageChannel
    : T extends ChannelTypes.GUILD_STORE
    ? StoreChannel
    : T extends ChannelTypes.GUILD_TEXT
    ? TextChannel
    : T extends ChannelTypes.GUILD_VOICE
    ? VoiceChannel
    : never;
