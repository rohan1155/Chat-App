import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setAuthenticated(true);
    }
  }, [navigate]);
  if (!authenticated) {
    return null;
  }

  return (
    <div className="home">
      <Sidebar />
      <Outlet />
    </div>
  );
}
