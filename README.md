<h1 align="center">DJS-SLASH</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/djs-slash" target="_blank">
        <img alt="Version" src="https://img.shields.io/npm/v/djs-slash.svg">
    </a>
     <a href="https://github.com/tguichaoua/djs-slash/blob/main/LICENSE" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/github/license/tguichaoua/djs-slash" />
    </a>
    <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-blue.svg" />
    <img alt="Dependency discordjs" src="https://img.shields.io/npm/dependency-version/djs-slash/peer/discord.js" />
</p>

> A Slash Command handler for discord.js v13

**Warning**: `dsj-slash` is based on [`discord.js`](https://www.npmjs.com/package/discord.js) v13 currently under developpement. `dsj-slash`'s API may change a lot until it's `1.x` relase.

## Install

Install by running this command:

```sh
npm i djs-slash
```

[`discord.js`](https://www.npmjs.com/package/discord.js) v13 is also required.

## How to use

Commands will be load at runtime from the `commands` folder. Files contains the command. Folder are used to create sub command and sub command group.

The name of the command is the name of the file (without the extension).

```
└ commands/
  ├ ping.ts
  └ cmd/
    ├ subcommand.ts
    └ subcommandgroup/
      └ subcommand.ts
```

Will create the following commands:

-   `/ping`
-   `/cmd subcommand`
-   `/cmd subcommandgroup subcommand`

### Command file

```ts
import { SlashCommand } from "djs-slash";

// Use SlashCommand.define to create your command
// The value must be exported with `export default`
export default SlashCommand.define(
    "Reply with 'pong'", // The description of the command
    {
        defaultPermission: true, // (optionnal) the defaultPermission option
        // The arguments of the command
        options: {
            // Create a argument named 'foo'
            foo: {
                type: "STRING",
                description: "The foo argument",
                required: true,
                choices: [
                    { name: "ping", value: "Ping" },
                    { name: "pong", value: "Pong" },
                ] as const, // `as const` is required to resolve properly the type of the argument.
            },
            // Create a argument named 'bar'
            bar: {
                type: "USER",
                description: "A user to mention",
            },
        },
    },
    // The callback of the function
    // The first parameter is the CommandInteraction
    // The second parameter is an object with the value of the argument
    async (interaction, { foo, bar }) => {
        // The type of the arguments are deduced from the value of `type` above.
        // If the argument is not required (by default) the value can be null.
        // foo : "Ping" | "Pong"
        // bar : User | null
        await interaction.reply(`:ping_pong: ${foo} !` + bar ? ` ${bar}` : "");
    },
);
```

### index.ts

```ts
import { Client, Intents } from "discord.js";
import { SlashCommandManager } from "djs-slash";

// Create the djs client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load all commands from ./commands/
const commands = SlashCommandManager.create();

client.once("ready", async (client) => {
    // Registering commands on a guild
    const guild = await client.guilds.fetch("000000000000000000");
    await guild.commands.set(commands.toApplicationCommandData());

    // Registering commands globally
    await client.application.commands.set(commands.toApplicationCommandData());
});

client.on("interactionCreate", async (interaction) => {
    // If the interaction is a command, pass it to the SlashCommandManager to execute the command
    if (interaction.isCommand()) await commands.execute(interaction);
});

(async () => {
    await client.login("BOT_TOKEN");
})();
```

## Example Project

To run the example project:

1. clone the repo `git clone https://github.com/tguichaoua/djs-slash.git`
2. go into the directory `cd djs-slash`
3. install dependencies `npm ci`
4. build the library `npm run build`
5. go into the example directory `cd example`
6. create a copy of `config.jsonc`, name it `config.json` and fill it up
7. run the example bot `npm start`

## Author

👤 **Tristan Guichaoua**

-   Github: [@tguichaoua](https://github.com/tguichaoua)

## 📝 License

Copyright © 2021 [Tristan Guichaoua](https://github.com/tguichaoua).<br />
This project is [MIT](https://github.com/tguichaoua/djs-slash/blob/main/LICENSE) licensed.
