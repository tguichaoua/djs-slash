import { SlashCommandCallback } from "../SlashCommandCallback";
import { isSlashCommandOptions, SlashCommandOptions } from "../SlashCommandOptions";
import { isRecord, isTypeof, TypeGuard } from "../utils/typeguard";

export interface SlashCommandData {
    readonly description: string;
    readonly options: SlashCommandOptions;
    readonly callback: SlashCommandCallback;
    readonly defaultPermission: boolean | undefined;
}

export const isSlashCommandData = isRecord({
    description: isTypeof("string"),
    options: isSlashCommandOptions,
    callback: isTypeof("function"),
    defaultPermission: isTypeof("boolean", "undefined"),
}) as TypeGuard<SlashCommandData>;
