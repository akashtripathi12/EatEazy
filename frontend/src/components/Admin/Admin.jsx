import React, { useContext, useState } from "react";
import "./Admin.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Admin = ({ setShowAdmin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });

  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {/* {currState === "Admin Login" ? (
            <input
              name="adminKey"
              onChange={onChangeHandler}
              value={data.adminKey}
              type="password"
              placeholder="Your Admin Key"
              required
            />
          ) : (
            <></>
          )} */}
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
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
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
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}> Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}> Login here</span>
          </p>
        )}
        {currState === "Login" || currState === "Sign Up" ? (
          <button onClick={() => setShowAdmin(true)}>
            Click here for Admin Login
          </button>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};
export default Admin;
