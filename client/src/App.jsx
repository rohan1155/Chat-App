import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "../components/Register";
import Login from "../components/Login";
import Home from "../components/Home";
import Chat from "../components/Chat";
import Welcome from "../components/Welcome";
import Account from "../components/Account";
import { useMediaQuery } from "@mui/material";
import MobileConversations from "../components/MobileConversations";

export default function App() {
  const isMobile = useMediaQuery("(max-width:1000px)");
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />}>
        {isMobile ? (
          <Route index element={<MobileConversations />} />
        ) : (
          <Route index element={<Welcome />} />
        )}
        <Route path="chat/:userId" element={<Chat />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
}
