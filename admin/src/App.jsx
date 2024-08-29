import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const { url, token, setToken } = useContext(StoreContext);

  const adminToken = {
    token: "",
  };

  const verifyLogin = async () => {
    const response = await axios.get(url + "/api/admin/getid");
    if (response.data.success) {
      adminToken.token = response.data.token;
      localStorage.setItem("token", adminToken.token);
      setToken(response.data.token);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyLogin();
  }, []);

  return (
    <div>
      {localStorage.getItem("token") ? (
        <div>
          <ToastContainer />
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/dashboard" element={<Dashboard url={url} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <h1>You are not logged in</h1>
        </div>
      )}
    </div>
  );
};

export default App;
