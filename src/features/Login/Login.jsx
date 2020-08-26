import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginCheck, selectValidatedFail } from "../Authentication/authSlice";
import Button from "../Button/Button";
import "../../css/LoginSignUp.css";

const Login = () => {
  const dispatch = useDispatch(); // react-redux method

  const validatedFail = useSelector(selectValidatedFail); // Boolean used once login details validation fail to show fail message

  const [loginDetails, setLoginDetails] = useState({
    // state for the form details
    email: "",
    password: "",
  });

  const handleLoginDetails = (e) => {
    // dynamically add loginDetails from the form inputs
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    dispatch(loginCheck(loginDetails)); // add state to redux state in authSlice
  };

  return (
    <div className="login-container">
      <div onSubmit={handleSubmit} className="login-sign-up-form">
        <label htmlFor="email" className="email">
          Email:
          <input
            type="text"
            name="email"
            id="email"
            value={loginDetails.email}
            onChange={handleLoginDetails}
          />
        </label>
        <label htmlFor="password" className="password">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            value={loginDetails.password}
            onChange={handleLoginDetails}
          />
        </label>
        {validatedFail ? (
          // login fail
          <p className="login-fail">Your email or password is incorrect</p>
        ) : null}
        <Button
          onClick={handleSubmit}
          btnMessage={"Login"}
          className={"submit"}
        />
      </div>
        <Link to="/signup" className="link">Sign Up</Link>
    </div>
  );
};

export default Login;
