"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useParams } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const [model, setModel] = useState<string>("deepseek-v3");
    const endRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const initializedRef = useRef(false);
    const { chat_id } = useParams();

    // useQuery 会在组件首次渲染时自动调用queryFn
    const { data: chat } = useQuery({
        queryKey: ["chat", chat_id],
        queryFn: () => {
            return axios.post("/api/get-chat", {
                chat_id: chat_id as string,
            });
        },
    });

    const { data: previousMessages } = useQuery({
        queryKey: ["messages", chat_id],
        queryFn: () => {
            return axios.get("/api/get-messages", {
                params: {
                    chat_id: chat_id as string,
                    chat_user_id: chat?.data?.userId,
                },
            });
        },
        enabled: !!chat?.data?.id, // 只有当 id 数据有值时才会触发请求
        // 确保创建新会话后快速切换，不会多次创建chat
        staleTime: 0, // 数据立即过期
        gcTime: 0, //禁用缓存
        refetchOnMount: true, //确保组件挂载时重新获取数据
    });

    const { messages, input, handleInputChange, handleSubmit, append } =
        useChat({
            body: {
                chat_id: chat_id as string,
                model: model,
                chat_user_id: chat?.data?.userId,
            },
            initialMessages: previousMessages?.data,
            onFinish: () => {
                setIsLoading(false);
            },
        });

    useEffect(() => {
        if (previousMessages?.data !== undefined && !initializedRef.current) {
            setModel(chat?.data?.model);
            if (chat?.data?.title && previousMessages?.data?.length === 0) {
                setIsLoading(true);
                append({
                    role: "user",
                    content: chat?.data?.title,
                });
            }
            initializedRef.current = true;
        }
    }, [previousMessages?.data, chat?.data?.model, chat?.data?.title, append]);

    useEffect(() => {
        if (endRef.current) {
            endRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    /**
     * @description 切换模型
     */
    const handleChangeModel = () => {
        setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3");
    };

    const handleSendMessage = async () => {
        if (isLoading || !input.trim()) return;
        setIsLoading(true);
        await handleSubmit();
    };

    return (
        <div className="flex flex-col h-screen items-center justify-between">
            <div className="flex flex-col w-2/3 gap-8 overflow-y-auto justify-between flex-1">
                <div className="h-4"></div>
                <div className="flex flex-col gap-8 flex-1">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`rounded-lg flex flex-row ${
                                message?.role === "assistant"
                                    ? "justify-start mr-18"
                                    : "justify-end ml-10"
                            }`}
                        >
                            <p
                                className={`inline-block p-2 rounded-lg ${
                                    message?.role === "assistant"
                                        ? "bg-blue-300"
                                        : "bg-slate-100"
                                }`}
                            >
                                {message.content}
                            </p>
                        </div>
                    ))}
                </div>
                {/* 进入页面时自动下滑 */}
                <div className="h-4" ref={endRef}></div>
            </div>
            {/* 输入框 */}
            <div className="flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg w-2/3">
                <textarea
                    className="w-full rounded-lg p-3 h-30 focus:outline-none resize-none"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            !e.nativeEvent.isComposing
                        ) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    disabled={isLoading}
                ></textarea>
                <div className="flex items-center justify-between w-full h-12 mb-2">
                    <div
                        className={`flex items-center justify-center rounded-lg border-[1px] px-2 py-1 ml-2 cursor-pointer ${
                            model === "deepseek-r1"
                                ? "border-blue-200 bg-blue-100"
                                : "border-gray-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={isLoading ? undefined : handleChangeModel}
                    >
                        <p className="text-sm">
                            {model === "deepseek-r1"
                                ? "Deepseek(R1)"
                                : "Deepseek(V3)"}
                        </p>
                    </div>
                    <div
                        className={`flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full ${
                            isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        onClick={isLoading ? undefined : handleSendMessage}
                    >
                        <EastIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}
