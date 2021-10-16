import { CommandInteractionOptionResolver, ContextMenuInteraction } from 'discord.js';

export type MessageCommandCallback = (
    interaction: ContextMenuInteraction,
    message: NonNullable<ReturnType<CommandInteractionOptionResolver['getMessage']>>,
) => void | Promise<void>;
