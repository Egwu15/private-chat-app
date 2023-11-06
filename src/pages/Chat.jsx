import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css"; // Import your CSS file

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const [content, setContent] = useState("");
  const [to, setTo] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("https://chat.tedif.com").connect();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("setUserId", userId);
    });

    newSocket.on("privateMessage", (content) => {
      setMessages((prevMessages) => [...prevMessages, content]);
    });

    return () => newSocket.disconnect();
  }, [userId]);

  const handleSendPrivateMessage = () => {
    setContent("");
    socket.emit("privateMessage", { content, to, userId });
  };

  return (
    <div className="chat-container">
      {" "}
      <div className="user-input">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient"
        />
        <button onClick={handleSendPrivateMessage}>Send Private Message</button>
      </div>
      <div className="message-container">
        {messages.map((message, index) => (
          <p key={index} className="message">
            {message.content} from {message.userId}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
