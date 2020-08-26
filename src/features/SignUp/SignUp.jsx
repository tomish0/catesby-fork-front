import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  addUser,
  validateSignUp,
  selectInputFail,
  selectValidatedFail,
  selectEmailRegistered,
} from "./signUpSlice";
import { signUpSchema } from "../../validation/validationSchemas";

import Button from "../Button/Button";
import "../../css/LoginSignUp.css";

const SignUp = () => {
  const dispatch = useDispatch(); // react-redux method

  const validatedFail = useSelector(selectValidatedFail); // Boolean used once signUp details aren't validated to show fail message
  const emailRegistered = useSelector(selectEmailRegistered); // Boolean used once signUp details aren't validated to show email already registered message
  const inputFail = useSelector(selectInputFail); // use to find errors on sign up fail in store

  const [signUpDetails, setSignUpDetails] = useState({
    // set initial state for the form details
    name: "",
    email: "",
    password: "",
    checkPassword: "",
  });
  const [preValidation, setPreValidation] = useState({
    // state used to check password data is valid before being sent to db
    passwordLength: false,
    checkPasswordLength: false,
    matchPassword: false,
  });
  const [passwordMatchCheck, setPasswordMatchCheck] = useState(false); // state used to highlight inputs when false

  useEffect(() => {
    // useEffect used to check password data is 8 characters or more, plus two passwords match
    setPreValidation({
      ...preValidation,
      passwordLength: signUpDetails.password.length >= 8 ? true : false,
      checkPasswordLength:
        signUpDetails.checkPassword.length >= 8 ? true : false,
      matchPassword:
        signUpDetails.checkPassword === signUpDetails.password ? true : false,
    });
  }, [signUpDetails]);

  const handleLoginDetails = (e) => {
    // dynamically add signUpDetails from the form inputs
    setSignUpDetails({
      ...signUpDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // validate the data by sending the chosen input data to the signUpSchema - made with the Joi package
    const validationResult = signUpSchema.validate(
      {
        name: signUpDetails.name,
        email: signUpDetails.email,
      },
      { abortEarly: false } // abortEarly used to send array with each error & not just the 1st input error that fails validation
    );
    // check the passwords pass the validation in the local state
    if (
      preValidation.passwordLength &&
      preValidation.checkPasswordLength &&
      preValidation.matchPassword
    ) {
      if (validationResult.error === undefined) {
        // if there is no error then add home address details to the store
        dispatch(addUser(signUpDetails)); // add state to redux state in authSlice
        setPasswordMatchCheck(false);
      } else {
        // if there are errors, then put each error name (name of the input) into a new array
        // array of input errors sent to store to add class & highligted border to the inputs with validation errors
        const errorArr = [];
        validationResult.error.details.forEach((err) => {
          errorArr.push(err.path[0]);
        });
        // send the new array to the store with validateLogin action
        dispatch(
          validateSignUp({ validatedLoginFail: true, inputFail: errorArr })
        );
        setPasswordMatchCheck(false);
      }
    }
    // the passwords failed the local state validation
    else {
      if (preValidation.matchPassword === false) {
        // password match fail so send message
        dispatch(validateSignUp({ validatedLoginFail: true, inputFail: [] }));
        setPasswordMatchCheck(true);
      } else {
        // password length fail so send message
        dispatch(validateSignUp({ validatedLoginFail: true, inputFail: [] }));
      }
    }
  };

  return (
    <div className="sign-up-container">
      <div onSubmit={handleSubmit} className="login-sign-up-form">
        <label htmlFor="name" className="name">
          Full Name:
          <input
            type="text"
            name="name"
            id="name"
            className={
              // if name has an input error then add class to highlight input
              inputFail.find((element) => element === "name")
                ? "fail-input-highlight"
                : null
            }
            value={signUpDetails.name}
            onChange={handleLoginDetails}
          />
        </label>
        <label htmlFor="email" className="email">
          Email:
          <input
            type="text"
            name="email"
            id="email"
            className={
              // if email has an input error or email is already registered
              // then add class to highlight input
              emailRegistered ||
              inputFail.find((element) => element === "email")
                ? "fail-input-highlight"
                : null
            }
            value={signUpDetails.email}
            onChange={handleLoginDetails}
          />
        </label>
        <div className="label-icon-container">
          <label htmlFor="password" className="password">
            Password:
            <input
              type="password"
              name="password"
              id="password"
              className={
                // if password match failed then add class to highlight input
                passwordMatchCheck ? "fail-input-highlight" : null
              }
              value={signUpDetails.password}
              onChange={handleLoginDetails}
            />
          </label>
          {preValidation.passwordLength ? (
            // an 'x' or a 'tick' icon is shown to indicate length of password
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="times-icon" />
          )}
        </div>
        <div className="label-icon-container">
          <label htmlFor="checkPassword" className="check-password">
            Re-Type <br /> Password:
            <input
              type="password"
              name="checkPassword"
              id="checkPassword"
              className={
                // if password match failed then add class to highlight input
                passwordMatchCheck ? "fail-input-highlight" : null
              }
              value={signUpDetails.checkPassword}
              onChange={handleLoginDetails}
            />
          </label>
          {preValidation.checkPasswordLength ? (
            // an 'x' or a 'tick' icon is shown to indicate length of password
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="times-icon" />
          )}
        </div>
        <div className="password-length">
          Your password must be 8 characters or more
        </div>
        {validatedFail ? (
          // signup fail
          <div className="login-fail">
            Sign Up Failed&nbsp;
            {passwordMatchCheck ? (
              // password match fail
              <span>- Password Match</span>
            ) : inputFail.find((element) => element === "name") ? (
              // highlight name if input error
              <span>- Please Fill</span>
            ) : inputFail.find((element) => element === "email") ? (
              // highlight email if input error
              <span>- Invalid Email</span>
            ) : emailRegistered ? (
              // hihglight email if already registered
              <span>- Email Already Registered</span>
            ) : null}
          </div>
        ) : null}
        <Button
          onClick={handleSubmit}
          btnMessage={"Sign Up"}
          className={"submit"}
        />
      </div>
      <Link to="/login" className="link">
        Back to Login
      </Link>
    </div>
  );
};

export default SignUp;
