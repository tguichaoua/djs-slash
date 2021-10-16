import fs from 'fs';
import path from 'path';
import { ApplicationCommandData, Interaction } from 'discord.js';

import {
    GroupSlashCommand,
    SingleSlashCommand,
    SlashCommand,
    SubCommandGroup,
    UserCommand,
    MessageCommand,
    AppCommand,
} from './command';
import { isSlashCommandData } from './data/SlashCommandData';
import { isGroupData } from './data';
import { isRecord, TypeGuard } from './utils/typeguard';
import { isUserCommandData } from './data/UserCommandData';
import { isMessageCommandData } from './data/MessageCommandData';

export class SlashCommandManager {
    private constructor(
        public readonly slashCommands: ReadonlyMap<string, SlashCommand>,
        public readonly userCommands: ReadonlyMap<string, UserCommand>,
        public readonly messageCommands: ReadonlyMap<string, MessageCommand>,
    ) {}

    toApplicationCommandData(): ApplicationCommandData[] {
        return [this.slashCommands, this.userCommands, this.messageCommands].flatMap((map) =>
            Array.from(map.values() as Iterable<AppCommand>).map((cmd) => cmd.toApplicationCommandData()),
        );
    }

    /**
     * Try to execute the requested command and return true if the command is found and executed, false otherwise.
     * @param interaction The interaction that request the command.
     * @returns Either or not the requeted command is found and executed.
     */
    async execute(interaction: Interaction): Promise<boolean> {
        if (interaction.isCommand()) {
            const command = this.slashCommands.get(interaction.commandName);
            if (command) {
                await command.execute(interaction);
                return true;
            }
        } else if (interaction.isContextMenu()) {
            if (interaction.targetType === 'USER') {
                const command = this.userCommands.get(interaction.commandName);
                if (command) {
                    await command.execute(interaction);
                    return true;
                }
            } else if (interaction.targetType === 'MESSAGE') {
                const command = this.messageCommands.get(interaction.commandName);
                if (command) {
                    await command.execute(interaction);
                    return true;
                }
            }
        }
        return false;
    }

    static create(options?: SlashCommandManagerOptions): SlashCommandManager {
        // If we are using ts-node, also include ts files.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const filter = process[Symbol.for('ts-node.register.instance')]
            ? (file: string) => file.endsWith('.js') || file.endsWith('.ts')
            : (file: string) => file.endsWith('.js');

        // Get the path to the commands folder.
        const commandFolder = resolveFromEntryPoint(options?.commandFolder ?? './commands');

        // Defines maps to store commands.
        const slashCommands = new Map<string, SlashCommand>();
        const userCommands = new Map<string, UserCommand>();
        const messageCommands = new Map<string, MessageCommand>();

        const loadCommandFile = <Data, Cmd>(
            folder: string,
            filename: string,
            dataGuard: TypeGuard<Data>,
            cmdCtor: new (name: string, data: Data) => Cmd,
            map: Map<string, Cmd>,
        ) => {
            if (!filter(filename)) return;
            const filepath = path.resolve(path.format({ dir: folder, base: filename }));
            const module = require(filepath) as unknown; // eslint-disable-line @typescript-eslint/no-var-requires
            if (isRecord({ default: dataGuard })(module)) {
                const name = filename.substring(0, filename.lastIndexOf('.'));
                const command = new cmdCtor(name, module.default);
                map.set(name, command);
            } else {
                console.error('Invalid slash command file :', filepath);
            }
        };

        // Load slags commands
        {
            const folder = path.join(commandFolder, './slash');

            const loadSlashCommand = (folder: string, filename: string, map: Map<string, SlashCommand>) =>
                loadCommandFile(folder, filename, isSlashCommandData, SingleSlashCommand, map);

            const loadGroupDataFile = (folder: string, filename: string) => {
                const filepath = path.resolve(path.format({ dir: folder, base: filename }));
                const module = require(filepath) as unknown; // eslint-disable-line @typescript-eslint/no-var-requires
                if (isGroupModule(module)) {
                    return module.default;
                } else {
                    console.error('Invalid group data file :', filepath);
                    return {};
                }
            };

            for (const l1 of fs.readdirSync(folder, { withFileTypes: true })) {
                if (l1.isFile()) loadSlashCommand(folder, l1.name, slashCommands);
                else if (l1.isDirectory()) {
                    const folder1 = path.join(folder, l1.name);

                    const subCommands = new Map<string, SingleSlashCommand>();
                    const groups = new Map<string, SubCommandGroup>();
                    let description = l1.name;
                    let defaultPermission: boolean | undefined = undefined;

                    for (const l2 of fs.readdirSync(folder1, { withFileTypes: true })) {
                        if (l2.isFile()) {
                            if (l2.name.startsWith('_.')) {
                                const data = loadGroupDataFile(folder1, l2.name);
                                if (data.description !== undefined) description = data.description;
                                defaultPermission = data.defaultPermission;
                            } else loadSlashCommand(folder1, l2.name, subCommands);
                        } else if (l2.isDirectory()) {
                            const folder2 = path.join(folder1, l2.name);
                            const subCommands = new Map<string, SingleSlashCommand>();
                            let description = l2.name;
                            let defaultPermission: boolean | undefined = undefined;

                            fs.readdirSync(folder2, { withFileTypes: true })
                                .filter((f) => f.isFile())
                                .forEach((l3) => {
                                    if (l3.name.startsWith('_.')) {
                                        const data = loadGroupDataFile(folder2, l3.name);
                                        if (data.description !== undefined) description = data.description;
                                        defaultPermission = data.defaultPermission;
                                    } else loadSlashCommand(folder2, l3.name, subCommands);
                                });

                            groups.set(l2.name, { name: l2.name, description, defaultPermission, subCommands });
                        }
                    }

                    slashCommands.set(
                        l1.name,
                        new GroupSlashCommand(l1.name, description, defaultPermission, subCommands, groups),
                    );
                }
            }
        } // Load slash commands.

        // Load user commands.
        {
            const folder = path.join(commandFolder, './user');
            fs.readdirSync(folder, { withFileTypes: true })
                .filter((f) => f.isFile())
                .forEach((f) => loadCommandFile(folder, f.name, isUserCommandData, UserCommand, userCommands));
        } // Load user commands.

        // Load message commands.
        {
            const folder = path.join(commandFolder, './message');
            fs.readdirSync(folder, { withFileTypes: true })
                .filter((f) => f.isFile())
                .forEach((f) => loadCommandFile(folder, f.name, isMessageCommandData, MessageCommand, messageCommands));
        } // Load message commands.

        return new SlashCommandManager(slashCommands, userCommands, messageCommands);
    }
}

interface SlashCommandManagerOptions {
    commandFolder?: string;
}

const isGroupModule = isRecord({ default: isGroupData });

function resolveFromEntryPoint(filepath: string) {
    return require.main ? path.resolve(require.main.path, filepath) : filepath;
}
