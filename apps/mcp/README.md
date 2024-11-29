# Claudekeep MCP

An MCP Server for saving and sharing prompts, transcripts and more.

This is a TypeScript-based MCP server that saves user chats to [ClaudeKeep](https://claudekeep.com).

## Features

### Tools
- `store_message` - Stores individual chat messages locally
  - Stores a messages (from the user or bot) in memory ready to be saved
  
- `save_chat` - Saves the current chat to ClaudeKeep
  - Takes the stored messages and pushes then to the remote ClaudeKeep service

### Prompts

- `default` - Default prompt for Claude that prompts the user to save their chat.


## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, you need to add the server config to the following file:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

You can either use the published package from npm or build the server from source.

### From npm

Use this config and then restart Claude Desktop:

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

### From source

Clone this repo:

```bash
git clone https://github.com/sdairs/claudekeep.git
```
From the repo root, install the dependencies: 

```bash
pnpm install
```

Then build the server:

```bash
pnpm build
```

Use this config and then restart Claude Desktop:

```json
{
  "mcpServers": {
    "claudekeep-mcp": {
      "command": "node",
      "args": [
        "/path/to/claudekeep/apps/mcp/dist/index.js",
      ],
      "env": {
        "CLAUDEKEEP_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
