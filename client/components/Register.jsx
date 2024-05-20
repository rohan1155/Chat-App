import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../src/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const muiTheme = createTheme({ palette: { mode: "dark" } });

  const [data, setData] = useState({ name: "", username: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("/user/register", data);
      // console.log(response);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response.data.message;
      console.log("Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  return (
    <div className="login">
      <img src="images/logo.svg" alt="" className="login-logo" />
      <ThemeProvider theme={muiTheme}>
        <div className="login-container">
          <h1 className="login-text">Create an Account</h1>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            autoComplete="off"
            value={data.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="login-text-field"
          />
          <TextField
            label="Username"
            variant="outlined"
            name="username"
            autoComplete="off"
            value={data.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="login-text-field"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="login-text-field"
          />
          <Button
            variant="outlined"
            onClick={handleSubmit}
            sx={{ width: "100px" }}
          >
            Sign Up
          </Button>
          <div>
            <span>Already have an Account? </span>
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </div>
        </div>
        <ToastContainer theme="dark" />
      </ThemeProvider>
    </div>
  );
}
