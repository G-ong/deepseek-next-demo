import { auth } from "@clerk/nextjs/server";
import { getMessagesByChatId } from "@/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get("chat_id");
    const chat_user_id = searchParams.get("chat_user_id");
    const { userId } = await auth();

    if (!userId || userId !== chat_user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!chat_id) {
        return new Response("Missing chat_id", { status: 400 });
    }

    const messages = await getMessagesByChatId(parseInt(chat_id));

    return new Response(JSON.stringify(messages), { status: 200 });
}
