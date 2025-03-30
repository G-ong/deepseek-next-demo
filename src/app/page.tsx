"use client";

import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
    const [input, setInput] = useState<string>("");
    const [model, setModel] = useState<string>("deepseek-v3");
    const queryClient = useQueryClient();
    const router = useRouter();
    const { user } = useUser();

    /**
     * @description 切换模型
     */
    const handleChangeModel = () => {
        setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3");
    };

    // Mutations
    const { mutate: createChat } = useMutation({
        mutationFn: async () => {
            return await axios.post("/api/create-chat", {
                title: input,
                model: model,
            });
        },
        onSuccess: (res) => {
            router.push(`/chat/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });

    /**
     * @description 创建新对话
     */
    const handleSubmit = () => {
        if (!user) {
            router.push("/sign-in");
            return;
        }
        if (input.trim() === "") {
            return;
        }
        createChat();
    };

    return (
        <div className="h-screen flex flex-col items-center">
            <div className="h-1/5"></div>
            <div className="w-1/2">
                <p className="text-bold text-2xl text-center">
                    有什么可以帮您的吗
                </p>
                <div className="flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg">
                    <textarea
                        className="w-full rounded-lg p-3 h-30 focus:outline-none resize-none"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                !e.shiftKey &&
                                !e.nativeEvent.isComposing
                            ) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    ></textarea>
                    <div className="flex items-center justify-between w-full h-12 mb-2">
                        <div
                            className={`flex  items-center justify-center   rounded-lg border-[1px] px-2 py-1 ml-2 cursor-pointer ${
                                model === "deepseek-r1"
                                    ? "border-blue-200 bg-blue-100"
                                    : "border-gray-300"
                            }`}
                            onClick={handleChangeModel}
                        >
                            <p className="text-sm">
                                {model === "deepseek-r1"
                                    ? "Deepseek(R1)"
                                    : "Deepseek(V3)"}
                            </p>
                        </div>
                        <div
                            className="flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full"
                            onClick={handleSubmit}
                        >
                            <EastIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
