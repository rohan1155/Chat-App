import { IconButton, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Messages from "./Messages";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import axios from "../src/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

export default function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");
  const isMobile = useMediaQuery("(max-width:1000px)");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [useSocket, setSocket] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`/user/users/${params.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserName();
  }, [params.userId]);

  if (!authenticated) {
    return null;
  }

  const sendMessage = async () => {
    try {
      const data = {
        receiverId: params.userId,
        content: message,
      };
      if (!data.content) {
        toast.error("Enter a message");
        return;
      }
      const response = await axios.post("/messages", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        await useSocket.emit("newMessage", data);
        await useSocket.emit("messageSent");
        setMessage("");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const deleteChat = async () => {
    try {
      const response = await axios.delete(`/messages/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        navigate("/home");
        await useSocket.emit("chatDeleted");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };
  return (
    <>
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-icon">
            {isMobile ? (
              <IconButton onClick={() => navigate("/home")}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => navigate("/home")}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
          <div className="chat-title">{userName}</div>
          <IconButton onClick={deleteChat}>
            <DeleteIcon />
          </IconButton>
        </div>
        <Messages />
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
      <ToastContainer theme="dark" />
    </>
  );
}
