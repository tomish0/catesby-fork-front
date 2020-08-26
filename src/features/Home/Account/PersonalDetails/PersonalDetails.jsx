import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPersonalDetails,
  putPersonalDetails,
  updateStatus,
  selectPersonalDetails,
  selectUpdateStatus,
} from "./personalDetailsSlice";
import { personalDetailsSchema } from "../../../../validation/validationSchemas";
import ChangePassword from "./ChangePassword.jsx";
import Button from "../../../Button/Button";

const PersonalDetails = () => {
  const dispatch = useDispatch(); // react-redux method

  const placeholderData = useSelector(selectPersonalDetails); // a snapshot of current data in slice
  const currentUpdateStatus = useSelector(selectUpdateStatus); // current update status from the store

  const [personalDetails, setPersonalDetails] = useState({
    // State for the form details
    name: "",
    email: "",
    phoneNumber: "",
  });

  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    // on load of component get the current personal details from db to put into placeholders
    dispatch(getPersonalDetails());
  }, []);

  useEffect(() => {
    // handle when updateComplete / updateFail is true & message shows,
    // then remove message after timeout or leave component
    var updateTimer;
    if (currentUpdateStatus.updateComplete || currentUpdateStatus.updateFail) {
      updateTimer = setTimeout(function () {
        dispatch(
          updateStatus({
            updateComplete: false,
            updateFail: false,
            inputFail: [],
          })
        );
      }, 20000);
    }
    return () => {
      if (updateTimer !== undefined) {
        dispatch(
          updateStatus({
            updateComplete: false,
            updateFail: false,
            inputFail: [],
          })
        );
        clearTimeout(updateTimer);
      }
    };
  }, [currentUpdateStatus.updateComplete, currentUpdateStatus.updateFail]);

  const handlePersonalDetails = (e) => {
    setChangeMade(true); // change occured so request will be sent
    // dynamically add personalDetails from the form inputs
    setPersonalDetails({
      ...personalDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // only post if change occured = true
    if (changeMade) {
      const data = {
        // if a form input has been typed into giving it a length then send the data
        // otherwise send the data that was previously obtained from the store & put into the placeholders
        // avoids issue of sending in partial data - filling in one field & not the rest
        name:
          personalDetails.name.length > 0
            ? personalDetails.name.trim()
            : placeholderData.name.trim(),
        email:
          personalDetails.email.length > 0
            ? personalDetails.email.trim()
            : placeholderData.email.trim(),
        phoneNumber:
          personalDetails.phoneNumber.length > 0
            ? personalDetails.phoneNumber.trim()
            : placeholderData.phoneNumber.trim(),
      };
      // validate the data by sending the chosen input data to the addressSchema - made with the Joi package
      const validationResult = personalDetailsSchema.validate(
        {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        { abortEarly: false } // abortEarly used to send array with each error & not just the 1st input error that fails validation
      );
      if (validationResult.error === undefined) {
        // if there is no error then add home address details to the store
        dispatch(putPersonalDetails(data));
      } else {
        // if there are errors, then put each error name (name of the input) into a new array
        const errorArr = [];
        validationResult.error.details.forEach((err) => {
          errorArr.push(err.path[0]);
        });
        // send the new array to the store with updateStatus action
        // updateFail set as true to show update fail message
        // array of input errors sent to store to add class & highligted border to the inputs with validation errors
        dispatch(updateStatus({ updateFail: true, inputFail: errorArr }));
      }
    }
  };

  return (
    <div className="personal-details-section">
      <div onSubmit={handleSubmit} className="my-form">
        <label htmlFor="name">
          Full Name:
          <input
            type="text"
            name="name"
            id="name"
            className={
              // if name has an input error then add class to highlight input
              currentUpdateStatus.inputFail.find(
                (element) => element === "name"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={placeholderData.name}
            value={personalDetails.name}
            onChange={handlePersonalDetails}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            id="email"
            className={
              // if email has an input error then add class to highlight input
              currentUpdateStatus.emailExists ||
              currentUpdateStatus.inputFail.find(
                (element) => element === "email"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={placeholderData.email}
            value={personalDetails.email}
            onChange={handlePersonalDetails}
          />
        </label>
        <label htmlFor="phoneNumber">
          Phone Number:
          <input
            type="number"
            name="phoneNumber"
            id="phoneNumber"
            className={
              // if phoneNumber has an input error then add class to highlight input
              currentUpdateStatus.inputFail.find(
                (element) => element === "phoneNumber"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={placeholderData.phoneNumber}
            value={personalDetails.phoneNumber}
            onChange={handlePersonalDetails}
          />
        </label>
        {currentUpdateStatus.updateComplete ? (
          // updateComplete is true then show message
          <div className="update-completed">Update Completed</div>
        ) : currentUpdateStatus.updateFail ? (
          // updateFail is true then show message
          <div className="update-fail">
            Update Fail&nbsp;
            {currentUpdateStatus.emailExists ? (
              // if email exists in db then add emailExists message
              <span>- Email Already Registered</span>
            ) : currentUpdateStatus.inputFail.find(
                (element) => element === "email"
              ) ? (
              // if email in the input fails front-end validation then message will show
              <span>- Invalid Email</span>
            ) : null}
          </div>
        ) : null}
        <Button
          onClick={handleSubmit}
          btnMessage={"Update"}
          className={"update account-submit"}
        />
      </div>
      <div>
        <ChangePassword />
      </div>
    </div>
  );
};

export default PersonalDetails;
