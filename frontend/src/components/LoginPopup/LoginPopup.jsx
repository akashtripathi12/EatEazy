import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });

  const onChangeHandlerAdmin = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAdminData((adminData) => ({ ...adminData, [name]: value }));
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else if (currState === "Sign Up") {
      newUrl += "/api/user/register";
    } else {
      newUrl += "/api/admin/login";
    }

    if (currState === "Login" || currState === "Sign Up") {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } else {
      const response = await axios.post(newUrl, adminData);
      if (response.data.success) {
        setShowLogin(false);
        const token = response.data.token;
        let NewUrl = url;
        NewUrl += "/api/admin/dashboard";
        const resToken = await axios.post(NewUrl, { token: token });
        if (resToken.data.success) {
          window.open("http://localhost:5174/");
        } else {
          console.log(resToken.data.message);
        }
      } else {
        let NewUrl = url;
        NewUrl += "/api/admin/register";
        const response = await axios.post(NewUrl, adminData);
        if (response.data.success) {
          setShowLogin(false);
          const token = response.data.token;
          window.open(`http://localhost:5174/?token=${token}`);
          setToken("");
        } else {
          alert(response.data.message);
        }
      }
    }
  };

  const googleSuccess = async (event) => {
    const decoded = jwtDecode(event.credential);
    const name = decoded.name;
    const email = decoded.email;

    let NewUrl = url;
    NewUrl += "/api/user/googleauth";

    data.name = name;
    data.email = email;
    data.password = "password123";
    const response = await axios.post(NewUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      let newUrl = url;
      newUrl += "/api/user/login";
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Admin Login" ? (
            <input
              name="adminKey"
              onChange={onChangeHandlerAdmin}
              value={adminData.adminKey}
              type="password"
              placeholder="Admin Key"
              required
            />
          ) : (
            <></>
          )}
          {currState === "Login" || currState === "Admin Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          {currState === "Admin Login" ? (
            <input
              name="email"
              onChange={onChangeHandlerAdmin}
              value={adminData.email}
              type="email"
              placeholder="Admin email"
              required
            />
          ) : (
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Your email"
              required
            />
          )}

          {currState === "Admin Login" ? (
            <input
              name="password"
              onChange={onChangeHandlerAdmin}
              value={adminData.password}
              type="password"
              placeholder="Admin Password"
              required
            />
          ) : (
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          )}
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" || currState === "Sign Up" ? (
          <div className="google">
            <GoogleLogin
              onSuccess={(event) => {
                googleSuccess(event);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        ) : (
          <></>
        )}
        {currState === "Login" ? (
          <p>
            Create a new User account?{" "}
            <span onClick={() => setCurrState("Sign Up")}> Click here</span>
          </p>
        ) : (
          <p>
            Already have an User account?{" "}
            <span onClick={() => setCurrState("Login")}> Login here</span>
          </p>
        )}
        {currState === "Login" || currState === "Sign Up" ? (
          <p>
            Admin Login?{" "}
            <span onClick={() => setCurrState("Admin Login")}>Login here</span>
          </p>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
