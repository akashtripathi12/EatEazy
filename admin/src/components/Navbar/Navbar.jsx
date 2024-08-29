import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
const Navbar = () => {
  const { url, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = async () => {
    const response = await axios.post(url + "/api/admin/dashboard", {
      token: "",
    });
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      {/* <img className="profile" src={assets.profile_image} alt="" /> */}
      {token ? (
        <div className="navbar-profile">
          <img className="profile" src={assets.profile_image} alt="" />
          <ul className="navbar-profile-dropdown">
            <li onClick={() => navigate("/dashboard")}>
              <img src={assets.profile_image} alt="" />
              <p>DashBoard</p>
            </li>
            <li onClick={logout}>
              <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
