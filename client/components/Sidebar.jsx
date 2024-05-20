import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConversationItem from "./ConversationItem";
import HomeIcon from "@mui/icons-material/Home";
// import ChatIcon from "@mui/icons-material/Chat";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function Sidebar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:1000px)");
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const hideHeader = isMobile && /\/home\/chat\/[^/]+/.test(location.pathname);

  return (
    <div className="sidebar-container">
      {!hideHeader ? (
        <div className="sidebar-header">
          <IconButton onClick={() => navigate("account")}>
            <AccountCircleIcon className="sidebar-icon" />
          </IconButton>
          <IconButton onClick={() => navigate("/home")}>
            <HomeIcon className="sidebar-icon" />
          </IconButton>
          <IconButton onClick={() => setOpenDialog(true)}>
            <LogoutIcon className="sidebar-icon" />
          </IconButton>
        </div>
      ) : null}
      <div className="sidebar-content">
        <ConversationItem />
      </div>
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
      >
        Are you sure you want to Logout?
      </ConfirmDialog>
    </div>
  );
}
