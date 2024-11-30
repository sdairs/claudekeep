# ClaudeKeep

ClaudeKeep is an experiment with Model Context Protocol (MCP) to save and share your AI conversations from Claude Desktop.

It includes:
- an MCP server implementation that allows you to ask Claude to save your chat
- a web app that allows you to view your private chats and see public chats

## WARNING - THIS IS AN EXPERIMENT

This is an experiment. Please do not assume that it works perfectly or is secure.

While I have done some testing, I make no guarantees that I've caught every edge case to make sure your chats are not exposed. I suggest you don't test it with sensitive chats.

## How to use it?

### 1. Login and get a token

Go to [https://claudekeep.com](https://claudekeep.com) and hit **Login**. This will attempt to log you in via OAuth with GitHub. At the moment, this is the only OAuth provider supported.

Once logged in, in the top right you'll see a box with a JWT token, copy it.

### 2. Configure Claude Desktop to use the MCP server

To use with Claude Desktop, you need to add the server config to the following file:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

Use this config and then restart Claude Desktop (you must completely kill it CMD+Q style and then restart it):

```json
{
  "mcpServers": {
    "claudekeep-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "claudekeep-mcp"
      ],
      "env": {
        "CLAUDEKEEP_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

Claude Desktop can be awkward with reading your PATH. See the [MCP readme](./apps/mcp/README.md) for more info if the MCP server doesn't work.

### 3. Select the MCP and chat with Claude

When you open Claude Desktop, there is a little paperclip icon. Hover over it and there will be a little plug icon. Click that and pick `default` under `claudekeep-mcp`. This will attach the default prompt to Claude. 

Now just chat with Claude as normal.

Every message you write will trigger the `store_message` tool. This will store the message locally in Claude Desktop.

When you want to save your chat, just ask Claude. Claude will run the `save_chat` tool. By default chats are always stored as private. If you want to make your chat public straight away, let claude know when you ask it to save.

For example (but remember, it's an LLM, it's interpreting your langauge, so you can ask however you want and it will probably hopefully do the right thing):

To save a a private chat:
```
you: save this chat
```

To save a public chat:
```
you: save this chat and make it public
```

## Need help?

Raise an issue or contact me on [BlueSky](https://bsky.app/profile/alasdairb.com).

## Refresh your token

If you accidentally expose your token, login and hit the little refresh icon next to the token. You'll see a warning, click the confirm button and it will generate a new token. The old token will be destroyed and is not recoverable.

## Abuse

I hope people are good and don't share dodgy chats, but it's the internet, so 🤷‍♂️ it'll probably happen. I'll do my best to catch it, but please nudge me on BlueSky if I miss something.

Note that your chats are stored against your GitHub account, so while public chats are anonymous to other users, they're not anonymous on the server.