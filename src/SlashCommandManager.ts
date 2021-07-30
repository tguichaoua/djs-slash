import fs from "fs";
import path from "path";
import { ApplicationCommandData, CommandInteraction } from "discord.js";

import { GroupSlashCommand, SingleSlashCommand, SlashCommand, SubCommandGroup } from "./command";
import { isSlashCommandData } from "./data/SlashCommandData";
import { isGroupData } from "./data";
import { isRecord } from "./utils/typeguard";

export class SlashCommandManager {
    private constructor(public readonly commands: ReadonlyMap<string, SlashCommand>) {}

    toApplicationCommandData(): ApplicationCommandData[] {
        return Array.from(this.commands.values()).map((command) => command.toApplicationCommandData());
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);
        if (command) command.execute(interaction);
    }

    static create(options?: SlashCommandManagerOptions): SlashCommandManager {
        // If we are using ts-node, also include ts files.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const filter = process[Symbol.for("ts-node.register.instance")]
            ? (file: string) => file.endsWith(".js") || file.endsWith(".ts")
            : (file: string) => file.endsWith(".js");

        const commandFolder = resolveFromEntryPoint(options?.commandFolder ?? "./commands");

        const loadFile = (folder: string, filename: string, map: Map<string, SlashCommand>) => {
            if (!filter(filename)) return;
            const filepath = path.resolve(path.format({ dir: folder, base: filename }));
            const module = require(filepath) as unknown; // eslint-disable-line @typescript-eslint/no-var-requires
            if (isCommandModule(module)) {
                const command = new SingleSlashCommand(
                    filename.substring(0, filename.lastIndexOf(".")),
                    module.default,
                );
                if (command) map.set(command.name, command);
            } else {
                console.error("Invalid slash command file :", filepath);
                return;
            }
        };

        const loadGroupDataFile = (folder: string, filename: string) => {
            const filepath = path.resolve(path.format({ dir: folder, base: filename }));
            const module = require(filepath) as unknown; // eslint-disable-line @typescript-eslint/no-var-requires
            if (isGroupModule(module)) {
                return module.default;
            } else {
                console.error("Invalid group data file :", filepath);
                return {};
            }
        };

        const commands = new Map<string, SlashCommand>();

        for (const l1 of fs.readdirSync(commandFolder, { withFileTypes: true })) {
            if (l1.isFile()) loadFile(commandFolder, l1.name, commands);
            else if (l1.isDirectory()) {
                const folder1 = path.join(commandFolder, l1.name);

                const subCommands = new Map<string, SingleSlashCommand>();
                const groups = new Map<string, SubCommandGroup>();
                let description = l1.name;
                let defaultPermission: boolean | undefined = undefined;

                for (const l2 of fs.readdirSync(folder1, { withFileTypes: true })) {
                    if (l2.isFile()) {
                        if (l2.name.startsWith("_.")) {
                            const data = loadGroupDataFile(folder1, l2.name);
                            if (data.description !== undefined) description = data.description;
                            defaultPermission = data.defaultPermission;
                        } else loadFile(folder1, l2.name, subCommands);
                    } else if (l2.isDirectory()) {
                        const folder2 = path.join(folder1, l2.name);
                        const subCommands = new Map<string, SingleSlashCommand>();
                        let description = l2.name;
                        let defaultPermission: boolean | undefined = undefined;

                        fs.readdirSync(folder2, { withFileTypes: true })
                            .filter((f) => f.isFile())
                            .forEach((l3) => {
                                if (l3.name.startsWith("_.")) {
                                    const data = loadGroupDataFile(folder2, l3.name);
                                    if (data.description !== undefined) description = data.description;
                                    defaultPermission = data.defaultPermission;
                                } else loadFile(folder2, l3.name, subCommands);
                            });

                        groups.set(l2.name, { name: l2.name, description, defaultPermission, subCommands });
                    }
                }

                commands.set(
                    l1.name,
                    new GroupSlashCommand(l1.name, description, defaultPermission, subCommands, groups),
                );
            }
        }

        return new SlashCommandManager(commands);
    }
}

interface SlashCommandManagerOptions {
    commandFolder?: string;
}

const isCommandModule = isRecord({ default: isSlashCommandData });
const isGroupModule = isRecord({ default: isGroupData });

function resolveFromEntryPoint(filepath: string) {
    return require.main ? path.resolve(require.main.path, filepath) : filepath;
}
