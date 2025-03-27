import { auth } from "@clerk/nextjs/server";
import { getChats } from "@/db";

export async function POST() {
    const { userId } = await auth();

    if (userId) {
        const chats = await getChats(userId);
        return new Response(JSON.stringify(chats), { status: 200 });
    }

    return new Response("Unauthorized", { status: 401 });
}
