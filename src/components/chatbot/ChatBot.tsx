'use client';

import { useEffect, useState } from "react";
import styles from "./ChatBot.module.css";

export default function ChatBot() {
    const [show, setShow] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!show) return;

        const fetchChats = async () => {
            try {
                const res = await fetch("/api/chat");
                const data = await res.json();

                // Admin: tablica czatów, User: jeden czat
                const chatArray = Array.isArray(data) ? data : [data];
                setChats(chatArray);

                if (!selectedChatId && chatArray.length > 0) {
                    setSelectedChatId(chatArray[0].id);
                }

                if (selectedChatId) {
                    const resMsg = await fetch(`/api/chat/${selectedChatId}/messages`);
                    const messagesData = await resMsg.json();
                    setMessages(Array.isArray(messagesData) ? messagesData : []);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchChats();
        const interval = setInterval(fetchChats, 2000);
        return () => clearInterval(interval);
    }, [show, selectedChatId]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedChatId) return;

        try {
            await fetch(`/api/chat/${selectedChatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: input }),
            });
            setInput("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.chatbotWrapper}>
            <button className={styles.chatbotButton} onClick={() => setShow(!show)}>💬</button>

            {show && (
                <div className={styles.chatbotBox}>
                    {/* Lista czatów dla admina */}
                    {chats.length > 1 && (
                        <div className={styles.chatList}>
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    className={styles.chatListItem}
                                    onClick={() => setSelectedChatId(chat.id)}
                                >
                                    {chat.user?.first_name || "User"} {chat.user?.last_name || ""}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={styles.chatWindow}>
                        {(!Array.isArray(messages) || messages.length === 0) ? (
                            <p className={styles.empty}>Brak wiadomości</p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`${styles.message} ${msg.senderId === msg.sender?.id ? styles.userMsg : styles.adminMsg}`}>
                                    <span className={styles.sender}>{msg.sender?.first_name || "?"}:</span>{" "}
                                    {msg.content}
                                </div>
                            ))
                        )}
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Napisz wiadomość..."
                            className={styles.input}
                        />
                        <button onClick={sendMessage} className={styles.sendButton}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}
