"use client";
import React from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChatModel } from "@/db/schema";
import axios from "axios";

const NavBar = () => {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    /**
     * @description 获取用户会话列表
     */
    const { data: chats } = useQuery({
        queryKey: ["chats"],
        queryFn: () => {
            return axios.post("/api/get-chats");
        },
        enabled: !!user,
    });

    // 如果用户未登录，不显示导航栏
    if (!user) {
        return null;
    }

    return (
        <div className="w-1/5 h-screen bg-gray-50 overflow-y-auto p-3">
            <div className="flex items-center justify-between">
                <p className="font-bold text-2xl">Deepseek</p>
                <SignOutButton>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                        退出登录
                    </button>
                </SignOutButton>
            </div>
            <div
                className="h-10 flex items-center justify-center mt-4 cursor-pointer"
                onClick={() => {
                    router.push("/");
                }}
            >
                <p className="h-full w-full flex items-center justify-center bg-blue-100 rounded-lg">
                    创建新会话
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-6">
                {chats?.data?.map((chat: ChatModel) => (
                    <div
                        className="w-full h-10"
                        key={chat.id}
                        onClick={() => {
                            router.push(`/chat/${chat.id}`);
                        }}
                    >
                        <p
                            className={`text-sm line-clamp-1 ${
                                pathname === `/chat/${chat.id}`
                                    ? "font-extrabold text-blue-500"
                                    : "font-normal"
                            }`}
                        >
                            {chat?.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NavBar;
