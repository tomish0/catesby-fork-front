import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  validateLogin,
  selectUserId,
} from "./features/Authentication/authSlice";
import { selectAppConnectionStatus } from "./data/network/networkStatusSlice";
import "./css/App.css";
import Auth from "./features/Authentication/Authentication";
import Home from "./features/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ConnectionMiddleware from "./data/network/NetworkController";
import AxiosController from "./data/axios/axiosController";
import { domain } from "./whichDomain/whichDomain";

// import axios from 'axios';
import axios from "axios";
import store from "./app/store";

// Bootstraping
ConnectionMiddleware.init();
AxiosController.init();

const App = () => {
  const appOnline = useSelector(selectAppConnectionStatus);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    // Check if a previous session exists and is valid
    const token = localStorage.getItem("token");
    if (token) {
      const tokenData = JSON.parse(token);
      axios.post(`${domain}/authentication/verify-token`).then((res) => {
        if (res.status === 200) {
          store.dispatch(
            validateLogin({ userId: tokenData.id, validateLoginFail: false })
          );
        }
      });
    }
  }, []);

  return (
    <div className="app">
      <ToastContainer />
      {appOnline ? userId ? <Home /> : <Auth /> : "You are Offline!"}
    </div>
  );
};

export default App;
