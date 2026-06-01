import { createChatHandler } from "@/chatbot/createChatHandler";
import { serverConfig } from "@/chatbot/config";

export const POST = createChatHandler(serverConfig);
