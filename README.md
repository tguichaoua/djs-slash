<h1 align="center">DJS-SLASH</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/djs-slash" target="_blank">
        <img alt="Version" src="https://img.shields.io/npm/v/djs-slash.svg">
    </a>
     <a href="https://github.com/tguichaoua/djs-slash/blob/main/LICENSE" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/github/license/tguichaoua/djs-slash" />
    </a>
    <a href="https://node.green/#ES2021">
        <img src="https://img.shields.io/badge/node-%3E%3D16.6.0-blue.svg" />
    </a>
    <a href="https://www.npmjs.com/package/discord.js">
        <img alt="Dependency discordjs" src="https://img.shields.io/npm/dependency-version/djs-slash/peer/discord.js" />
    </a>
</p>

djs-slash is a command handler for discord.js v13 that provides an easy command definition with file.  

**Features**:
- type checking (with TypeScript)
- slash command
- context menu command

## Install

Install by running this command:

```sh
npm i djs-slash
```

[`discord.js`](https://www.npmjs.com/package/discord.js) v13 is also required.

## How to use

Project architecture example
```
├ commands/                    (this folder contains all commands)
| ├ slash/                     (slash command)
| | ├ ping.ts
| | └ cmd/
| |   ├ subcommand.ts
| |   └ subcommandgroup/
| |     └ subcommand.ts
| ├ user/                      (context menu commands on user)
| | ├ hi.ts
| | └ ban.ts
| └ message/                   (context menu commands on message)
|   ├ delete.ts
|   └ repeat.ts
└ index.ts
```

### Load commands
```ts
const commands = SlashCommandManager.create({
    commandFolder: './commands' // This is the path to the folder where command are stored relative to the entry point of the application (ie the index.ts file)
});

// If no parameter is provided, './commands' is used as default path
const commands = SlashCommandManager.create();
```


### Full script example

```ts
import { Client, Intents } from "discord.js";
import { SlashCommandManager } from "djs-slash";

const GUILD_ID = '000000000000000000'
const BOT_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// Create the djs client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load all commands from ./commands/
const commands = SlashCommandManager.create();

client.once("ready", async (client) => {
    // Registering commands on a guild
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.commands.set(commands.toApplicationCommandData());

    // Registering commands globally
    await client.application.commands.set(commands.toApplicationCommandData());
});

client.on("interactionCreate", async (interaction) => {
    // Pass the interaction to the SlashCommandManager to execute the command
    if (await commands.execute(interaction)) {
        // The interaction trigger a command
    } else {
        // The interaction didn't trigger a command.
        // Either the interaction is not a command interaction
        // either it didn't correspond to a registred command.
    }
});

(async () => {
    await client.login(BOT_TOKEN);
})();
```

### Define a command

#### Slash command
Slash command files must be placed in a sub-folder named `slash` inside the command folder.  
The name of the file is the name of the command.  
To create sub-command and sub-command group use folder. Folder name is the name of the command/group.

ping example:
```ts
import { SlashCommand } from 'djs-slash';

export default SlashCommand.define("Reply with 'pong'", {}, async (interaction) => {
    await interaction.reply({ content: ':ping_pong: pong !', ephemeral: true });
});
```

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


`SlashCommand.define(description, options, callback)`  
- `description` `string`: the description of the command.
- `options` `{ defaultPermission, options }`
    - [`defaultPermission`](https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandData) `boolean`: whether the command is enabled by default when the app is added to a guild.
    - [`options`](https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOptionData) `object`: the options of the command, key is the name of the options.
        - `description` `string`: the description of the option.
        - `required` `boolean`: whether the option is required.
        - `type`: the type of the option.
        - `choices`: the choices of the option for the user to pick from.
        - `channelTypes`: when the option type is channel, the allowed types of channels that can be selected.
- `callback` `(interaction, options) => void | Promise<void>`
    - `interaction` [`CommandInteraction`](https://discord.js.org/#/docs/main/stable/class/CommandInteraction): the interaction object that trigger the command.
    - `options` `object`: a key-value object where key is the name of the option and the value the value provided by the user.

#### User command
User command files must be placed in a sub-folder named `user` inside the command folder.  
The name of the file is the name of the command.

An user command example:
```ts
import { UserCommand } from 'djs-slash';

export default UserCommand.define(async (interaction, user) => {
    await interaction.reply({ content: `Hi, ${user}` });
});
```
`UserCommand.define(callback)`  
- `callback` `(interaction, user) => void | Promise<void>`
    - `interaction` [`ContextMenuInteraction`](https://discord.js.org/#/docs/main/stable/class/ContextMenuInteraction): the interaction object that trigger the command.
    - `user` [`User`](https://discord.js.org/#/docs/main/stable/class/User): the target of the command.


#### Message command
Message command files must be placed in a sub-folder named `message` inside the command folder.  
The name of the file is the name of the command.

A message command example:
```ts
import { MessageCommand } from 'djs-slash';

export default MessageCommand.define(async (interaction, message) => {
    await interaction.reply({ content: message.content });
});
```
`MessageCommand.define(callback)`  
- `callback` `(interaction, message) => void | Promise<void>`
    - `interaction` [`ContextMenuInteraction`](https://discord.js.org/#/docs/main/stable/class/ContextMenuInteraction): the interaction object that trigger the command.
    - `user` [`Message`](https://discord.js.org/#/docs/main/stable/class/Message): the target of the command.


## Example Project
Checkout the example project to learn more.

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
