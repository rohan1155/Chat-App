import { useEffect, useState } from "react";
import axios from "../src/axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ConfirmDialog from "./ConfirmDialog";

export default function Account() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);

  if (!authenticated) {
    return null;
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/user/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="account">
      <p className="account-name">Name - {userData.name}</p>
      <p className="account-username">Username - {userData.username}</p>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setOpenDialog(true)}
      >
        Delete Account
      </Button>
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Confirm Deletion"
      >
        Are you sure you want to delete your account? This action cannot be
        undone.
      </ConfirmDialog>
    </div>
  );
}
