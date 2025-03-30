import { desc, eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chatsTable, messagesTable } from "./schema";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}
const client = postgres(process.env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    max_lifetime: 60 * 30,
    ssl: {
        rejectUnauthorized: false,
    },
});

const db = drizzle({ client });

// chats
export const createChat = async (
    title: string,
    userId: string,
    model: string
) => {
    try {
        const [newChat] = await db
            .insert(chatsTable)
            .values({
                title,
                userId,
                model,
            })
            .returning();
        return newChat;
    } catch (error) {
        console.error("Failed to create chat", error);
        return null;
    }
};

export const getChat = async (chatId: number, userId: string) => {
    try {
        const chat = await db
            .select()
            .from(chatsTable)
            .where(
                and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId))
            );
        if (chat.length === 0) {
            return null;
        }
        return chat[0];
    } catch (error) {
        console.error("Failed to get chat", error);
        return null;
    }
};

export const getChats = async (userId: string) => {
    try {
        const chats = await db
            .select()
            .from(chatsTable)
            .where(eq(chatsTable.userId, userId))
            .orderBy(desc(chatsTable.id));
        return chats;
    } catch (error) {
        console.error("Failed to get chats", error);
        return null;
    }
};

// message
export const createMessage = async (
    chat_id: number,
    role: string,
    content: string
) => {
    try {
        const [newMessage] = await db
            .insert(messagesTable)
            .values({
                chatId: chat_id,
                role,
                content,
            })
            .returning();
        return newMessage;
    } catch (error) {
        console.error("Failed to create message", error);
        return null;
    }
};

export const getMessagesByChatId = async (chatId: number) => {
    try {
        const messages = await db
            .select()
            .from(messagesTable)
            .where(eq(messagesTable.chatId, chatId))
            .orderBy(messagesTable.id); // 确保消息按 id 排序，不会乱序
        return messages;
    } catch (error) {
        console.error("Failed to get messages", error);
        return null;
    }
};
