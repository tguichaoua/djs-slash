import { CommandInteractionOptionResolver, ContextMenuInteraction } from 'discord.js';

export type UserCommandCallback = (
    interaction: ContextMenuInteraction,
    user: NonNullable<ReturnType<CommandInteractionOptionResolver['getUser']>>,
) => void | Promise<void>;
