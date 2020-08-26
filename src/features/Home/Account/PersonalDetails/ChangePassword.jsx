import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../Button/Button";
import { domain } from "../../../../whichDomain/whichDomain";

const ChangePassword = () => {
  // Note: all state / data is handled in component, not slice since don't want to store password in store
  const [passwordDetails, setPasswordDetails] = useState({
    // State for the form details
    currentPassword: "",
    newPassword: "",
    checkPassword: "",
  });
  const [preValidation, setPreValidation] = useState({
    // state used to check password data is valid before being sent to db
    currentPasswordLength: false,
    newPasswordLength: false,
    checkPasswordLength: false,
    matchPassword: false,
  });
  const [updateStatus, setUpdateStatus] = useState({
    // state to handle different outcomes on submit
    updateComplete: false,
    updateFail: false,
    currentPasswordFail: false,
    matchPasswordFail: false,
  });
  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    // handle when updateComplete / updateFail is true & message shows,
    // then remove message after timeout or leave component
    var updateTimer;
    if (updateStatus.updateComplete || updateStatus.updateFail) {
      updateTimer = setTimeout(function () {
        setUpdateStatus({
          updateComplete: false,
          updateFail: false,
          currentPasswordFail: false,
          matchPasswordFail: false,
        });
      }, 20000);
    }
    return () => {
      if (updateTimer !== undefined) {
        setUpdateStatus({
          updateComplete: false,
          updateFail: false,
          currentPasswordFail: false,
          matchPasswordFail: false,
        });
        clearTimeout(updateTimer);
      }
    };
  }, [updateStatus.updateComplete, updateStatus.updateFail]);

  useEffect(() => {
    // useEffect used to check password data is 8 characters or more, plus two passwords match
    setPreValidation({
      ...preValidation,
      currentPasswordLength:
        passwordDetails.currentPassword.length >= 8 ? true : false,
      newPasswordLength: passwordDetails.newPassword.length >= 8 ? true : false,
      checkPasswordLength:
        passwordDetails.checkPassword.length >= 8 ? true : false,
      matchPassword:
        passwordDetails.checkPassword === passwordDetails.newPassword
          ? true
          : false,
    });
  }, [passwordDetails]);

  const handlePasswordDetails = (e) => {
    setChangeMade(true); // change occured so request will be sent
    // dynamically add personalDetails from the form inputs
    setPasswordDetails({
      ...passwordDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // only post if change occured = true
    if (changeMade) {
      // check the passwords pass the local state validation
      if (
        preValidation.currentPasswordLength &&
        preValidation.newPasswordLength &&
        preValidation.checkPasswordLength &&
        preValidation.matchPassword
      ) {
        const data = {
          currentPassword: passwordDetails.currentPassword,
          newPassword: passwordDetails.newPassword,
        };
        const url = `${domain}/user/`;
        axios({
          method: "put",
          url: url,
          data: data,
        })
          .then((res) => {
            console.dir(res);
            // successful update, so send updateComplete message by altering local state
            setUpdateStatus({
              updateComplete: true,
            });
          })
          .catch((err) => {
            console.dir(err);
            setUpdateStatus({ updateFail: true }); // there was an error so send updateFail message
            if (err.response.status === 400) {
              // unsuccessful update since currentPassword doesn't match password in db,
              // so send updateFail / incorrect password message & add class to input by altering state
              setUpdateStatus({ updateFail: true, currentPasswordFail: true });
            }
          });
      } else {
        // front-end validation fail - length of passwords or password match fail
        if (preValidation.matchPassword === false) {
          // password match fail so add message to update fail message & add class to inputs
          setUpdateStatus({ updateFail: true, matchPasswordFail: true });
        } else {
          setUpdateStatus({ updateFail: true });
        }
      }
    }
  };

  return (
    <div onSubmit={handleSubmit} className="my-form password-details">
      <div className="label-icon-container">
        <label htmlFor="currentPassword" className="current-password">
          <span>Current Password:</span>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            className={
              // currentPassword does not match db so highlight input
              updateStatus.currentPasswordFail ? "fail-input-highlight" : null
            }
            value={passwordDetails.currentPassword}
            onChange={handlePasswordDetails}
          />
        </label>
        {preValidation.currentPasswordLength ? (
          // an 'x' or a 'tick' icon is shown to indicate lemgth of input
          <FontAwesomeIcon icon={faCheck} className="check-icon" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="times-icon" />
        )}
      </div>
      <div className="label-icon-container">
        <label htmlFor="newPassword">
          New Password:
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className={
              // passwords don't match so highlight inputs
              updateStatus.matchPasswordFail ? "fail-input-highlight" : null
            }
            value={passwordDetails.newPassword}
            onChange={handlePasswordDetails}
          />
        </label>
        {preValidation.newPasswordLength ? (
          // an 'x' or a 'tick' icon is shown to indicate lemgth of input
          <FontAwesomeIcon icon={faCheck} className="check-icon" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="times-icon" />
        )}
      </div>
      <div className="label-icon-container">
        <label htmlFor="checkPassword" className="check-password">
          Re-Type Password:
          <input
            type="password"
            name="checkPassword"
            id="checkPassword"
            className={
              // passwords don't match so highlight inputs
              updateStatus.matchPasswordFail ? "fail-input-highlight" : null
            }
            value={passwordDetails.checkPassword}
            onChange={handlePasswordDetails}
          />
        </label>
        {preValidation.checkPasswordLength ? (
          // an 'x' or a 'tick' icon is shown to indicate lemgth of input
          <FontAwesomeIcon icon={faCheck} className="check-icon" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="times-icon" />
        )}
      </div>
      <div className="password-length">
        Your password must contain 8 characters or more
      </div>
      {updateStatus.updateComplete ? (
        // updateComplete is true then show message
        <div className="update-completed">Update Completed</div>
      ) : updateStatus.updateFail ? (
        // updateFail is true then show message
        <div className="update-fail">
          Update Fail&nbsp;
          {updateStatus.matchPasswordFail ? (
            // passwords don't match so show message
            <span>- Password Match</span>
          ) : updateStatus.currentPasswordFail ? (
            // password doesn't match db so show message
            <span>- Incorrect Password</span>
          ) : null}
        </div>
      ) : null}
      <Button
        onClick={handleSubmit}
        btnMessage={"Update"}
        className={"update account-submit"}
      />
    </div>
  );
};

export default ChangePassword;
