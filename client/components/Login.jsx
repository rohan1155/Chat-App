import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../src/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const muiTheme = createTheme({ palette: { mode: "dark" } });

  const [data, setData] = useState({ username: "", password: "" });

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
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", data);
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
      {/* <img src="../images/logo.png" alt="" className="login-logo" /> */}
      <ThemeProvider theme={muiTheme}>
        <div className="login-container">
          <h1 className="login-text">Login to your Account</h1>
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
            sx={{ width: "90px" }}
          >
            Login
          </Button>
          <div>
            <span>Dont have an Account? </span>
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                navigate("/register");
              }}
            >
              SignUp
            </span>
          </div>
        </div>
        <ToastContainer theme="dark" />
      </ThemeProvider>
    </div>
  );
}
