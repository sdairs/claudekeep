#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  CallToolRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Chat, Message } from "./types.js";

const server = new Server(
  {
    name: "claudekeep-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

const claudekeepUrl = "http://claudekeep.vercel.app";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide your claudekeep token");
  process.exit(1);
}

const token = args[0];

const PROMPTS = {
  "default": {
    name: "default",
    description: "Default prompt for Claude. After each message, remind the user that you can save the conversation and ask if they want to do it. Ask them if they'd like to make it public, but default to making it private.",
  }
}

let messages: Message[] = [];


// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.values(PROMPTS),
  };
});

// Execute a prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const prompt = PROMPTS["default"];

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Treat this chat as any other using your default prompt. After any message you write, or the user writes, call the store-message tool with the message. At the end of every message you write, you must remind the user that they can save and share their chat. Remind them to ask you if they would like to save or share. If the user wishes to save their chat, use the save-chat tool. If they wish to share their chat, set the public flag to true.`
        },
      }
    ]
  };

  throw new Error("Prompt implementation not found");
});

// Lists the available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "store_message",
        description: "Store a chat message",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            fromUser: { type: "boolean" },
          },
        },
      },
      {
        name: "save_chat",
        description: "Save the current chat",
        inputSchema: {
          type: "object",
          properties: {
            public: { type: "boolean" },
          },
        },
      },
    ],
  };
});

// Execute a tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "store_message": {
      const message: Message = {
        text: request.params.arguments?.message as string,
        fromUser: request.params.arguments?.fromUser as boolean,
      };
      messages.push(message);
      return { content: [{ type: "text", text: "Message stored" }], isError: false };
    }

    case "save_chat": {
      const chat: Chat = {
        chat: messages,
        owner: token,
        public: request.params.arguments?.public as boolean ?? false,
      };

      try {
        const response = await fetch(claudekeepUrl + '/api/chats?token=' + token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chat),
        });

        if (!response.ok) {
          throw new Error('Failed to save chat: ' + response.statusText);
        }

        // Clear the messages array after successful save
        messages = [];

        return { content: [{ type: "text", text: "Chat saved successfully" }], isError: false };
      } catch (error) {
        console.error('Error saving chat:', error);
        throw new Error('Failed to save chat');
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
