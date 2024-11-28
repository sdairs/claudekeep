#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import pg from "pg";
import { ChatMessage } from "./types.js";

const server = new Server(
  {
    name: "mcp_save_and_share",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  },
);

console.log('test')

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a database URL as a command-line argument");
  process.exit(1);
}

const databaseUrl = args[0];

const resourceBaseUrl = new URL(databaseUrl);
resourceBaseUrl.protocol = "postgres:";
resourceBaseUrl.password = "";

const pool = new pg.Pool({
  connectionString: databaseUrl,
});

const SCHEMA_PATH = "schema";

const PROMPTS = {
  "default": {
    name: "default",
    description: "Generic prompt to start a chat that reminds the user to save their chats.",
  }
}

let messages: ChatMessage[] = [];

// Lists tables
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    );
    return {
      resources: result.rows.map((row) => ({
        uri: new URL(`${row.table_name}/${SCHEMA_PATH}`, resourceBaseUrl).href,
        mimeType: "application/json",
        name: `"${row.table_name}" database schema`,
      })),
    };
  } finally {
    client.release();
  }
});

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.values(PROMPTS)
  };
});

// Get specific prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const prompt = PROMPTS["default"];
  if (!prompt) {
    throw new Error(`Prompt not found: ${request.params.name}`);
  }

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Treat this chat as any other using your default prompt. After any message you write, or the user writes, call the store-message tool with the message. At the end of every message you write, you must remind the user that they can save and share their chat. Remind them to ask you if they would like to save or share. If the user wishes to save their chat, use the save-chat tool. If they wish to share their chat, use the share-chat tool.`
        }
      }
    ]
  };


  throw new Error("Prompt implementation not found");
});

// Describes a table
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resourceUrl = new URL(request.params.uri);

  const pathComponents = resourceUrl.pathname.split("/");
  const schema = pathComponents.pop();
  const tableName = pathComponents.pop();

  if (schema !== SCHEMA_PATH) {
    throw new Error("Invalid resource URI");
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
      [tableName],
    );

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(result.rows, null, 2),
        },
      ],
    };
  } finally {
    client.release();
  }
});

// Lists the available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query",
        description: "Run a read-only SQL query",
        inputSchema: {
          type: "object",
          properties: {
            sql: { type: "string" },
          },
        },
      },
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
        description: "Save a chat",
        inputSchema: {
          type: "object",
        },
      },
      {
        name: "share_chat",
        description: "Share a chat",
        inputSchema: {
          type: "object",
          properties: {
            chat: { type: "string" },
          },
        },
      },
    ],
  };
});

// Executes one of the tools listed above
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "store_message") {
    const message = request.params.arguments?.message as string;
    const fromUser = request.params.arguments?.fromUser as boolean;

    messages.push({ text: message, fromUser });
    return { content: [{ type: "text", text: "saved" }], isError: false };
  }

  if (request.params.name === "save_chat") {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const queryText = 'INSERT INTO chats(chat) VALUES($1) RETURNING id'
      const result = await client.query(queryText, [JSON.stringify(messages)]);
      await client.query("COMMIT");
      return {
        content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }],
        isError: false,
      };
    } catch (error) {
      throw error;
    } finally {
      client
        .query("ROLLBACK")
        .catch((error) =>
          console.warn("Could not roll back transaction:", error),
        );

      client.release();
    }
  }

  if (request.params.name === "share_chat") {
    return {};
  }

  throw new Error(`No implementation for tool: ${request.params.name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
