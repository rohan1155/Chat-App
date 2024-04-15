import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../src/axios";
import { format, parseISO } from "date-fns";
import io from "socket.io-client";
import { useMediaQuery } from "@mui/material";

export default function ConversationItem() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState([]);
  const isMobile = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    const socket = io("https://chat-app-36pq.onrender.com");
    socket.on("messageSent", () => {
      fetchUsers();
    });
    socket.on("chatDeleted", () => {
      fetchUsers();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();

    // Fetch users and their last messages
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      await fetchLastMessages(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLastMessages = async (users) => {
    try {
      const messages = {};
      for (const user of users) {
        const response = await axios.get(`/messages/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const lastMessage = response.data[response.data.length - 1];
        messages[user._id] = lastMessage || null; // Mark users without messages explicitly with null
      }
      setLastMessages(messages);
    } catch (error) {
      console.error("Error fetching last messages:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return format(parseISO(timestamp), "dd-MM-yyyy h:mm a");
  };

  // Separate users into two categories: with and without chats
  const usersWithChats = users.filter((user) => lastMessages[user._id]);
  const usersWithoutChats = users.filter((user) => !lastMessages[user._id]);

  // Sort usersWithChats based on the existence of last messages and their timestamps
  const sortedUsersWithChats = usersWithChats.sort((a, b) => {
    const lastMessageA = lastMessages[a._id];
    const lastMessageB = lastMessages[b._id];

    return parseISO(lastMessageB.timestamp) - parseISO(lastMessageA.timestamp);
  });

  if (isMobile) {
    return null;
  }

  return (
    <div>
      {sortedUsersWithChats.length > 0 && (
        <div>
          <p className="conversation-divider">Chats</p>
          {sortedUsersWithChats.map((user) => (
            <div
              key={user._id}
              className="conversation-item"
              onClick={() => navigate(`chat/${user._id}`)}
            >
              <div className="conversation-icon">{user.name[0]}</div>
              <div className="conversation-content">
                <div className="conversation-title">{user.name}</div>
                <div className="conversation-lastMessage">
                  {lastMessages[user._id] &&
                    (lastMessages[user._id].receiver === currentUser._id
                      ? ""
                      : "You: ") + lastMessages[user._id].content}
                </div>
              </div>
              <div className="conversation-timestamp">
                {lastMessages[user._id] &&
                  formatTimestamp(lastMessages[user._id].timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}

      {usersWithoutChats.length > 0 && (
        <div>
          <p className="conversation-divider">Available Users</p>
          {usersWithoutChats.map((user) => (
            <div
              key={user._id}
              className="conversation-item"
              onClick={() => navigate(`chat/${user._id}`)}
            >
              <div className="conversation-icon">{user.name[0]}</div>
              <div className="conversation-content">
                <div className="conversation-title">{user.name}</div>
                {/* <div className="conversation- lastMessage">No messages</div> */}
              </div>
              <div className="conversation-timestamp"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
