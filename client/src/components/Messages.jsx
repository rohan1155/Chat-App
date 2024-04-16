import { useEffect, useState } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import io from "socket.io-client";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("newMessage", (data) => {
      const receivedData = {
        receiver: data.receiverId,
        content: data.content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, receivedData]);
    });
    socket.on("chatDeleted", () => {
      fetchMessages();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [params.userId, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/messages/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return format(parseISO(timestamp), "dd-MM-yyyy h:mm a");
  };

  return (
    <div className="messages-container">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="loading">Start a conversation with this user.</p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={
              message.receiver === params.userId
                ? "self-message-container"
                : "other-message-container"
            }
          >
            <div
              className={
                message.receiver === params.userId
                  ? "self-messageBox"
                  : "other-messageBox"
              }
            >
              <p className="message-lastMessage">{message.content}</p>
              <p className="message-timeStamp">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
