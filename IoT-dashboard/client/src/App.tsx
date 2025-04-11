import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";


const socket = io("http://localhost:3000");


function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });


        return () => {
            socket.off("message");
        };
    }, []);


    const sendMessage = () => {
        if (message) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>WebSocket TWwAIR test App</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>💬 {msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wpisz wiadomość..."
            />
            <button onClick={sendMessage}>Wyślij</button>
        </div>
    );
}


export default App;