import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddressDetails,
  putAddressDetails,
  updateStatus,
  selectUpdateStatus,
  selectHomeAddress,
} from "./addressesSlice";
import { addressSchema } from "../../../../validation/validationSchemas";
import Button from "../../../Button/Button";

const HomeAddress = () => {
  const dispatch = useDispatch(); // react-redux method

  const homeAddress = useSelector(selectHomeAddress); // data for the home address retrieved from the store
  const currentUpdateStatus = useSelector(selectUpdateStatus); // current update status from the store

  const [homeAddressDetails, setHomeAddressDetails] = useState({
    // State for the form details
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    cityTown: "",
    stateCounty: "",
    postcode: "",
    country: "",
  });
  const [checked, setChecked] = useState(homeAddress.defaultDelivery); // populated with boolean received from db - store

  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    // set the checkbox to state in db
    setChecked(homeAddress.defaultDelivery);
  }, [homeAddress.defaultDelivery]);

  useEffect(() => {
    // handle when updateComplete / updateFail is true & message shows,
    // then remove message after timeout or leave component
    var updateTimer;
    if (currentUpdateStatus.updateComplete) {
      updateTimer = setTimeout(function () {
        dispatch(
          updateStatus({
            updateComplete: false,
            updateFail: false,
            inputFail: [],
          })
        );
      }, 15000);
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

  const handleHomeAddressDetails = (e) => {
    setChangeMade(true); // change occured so request will be sent
    // dynamically add home address details from the form inputs
    setHomeAddressDetails({
      ...homeAddressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = () => {
    setChangeMade(true); // change occured so request will be sent
    // Handle check on defaultDeliveryAddress checkbox
    setChecked(!homeAddress.defaultDelivery);
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // only post if change occured = true
    if (changeMade) {
      // if the user hasn't posted any data then use the placeholder data
      const data = {
        addressId: "home", // addressId is the key for each address obtained from the map method
        homeAddress: true, // homeAddress is preset as true
        DBLineId: homeAddress.DBLineId ? homeAddress.DBLineId : null, // add the id found for home address in db to use in PUT request
        defaultDelivery: checked, // Add defaultDeliveryAddress key to object with checked boolean
        // if a form input has been typed into giving it a length then send the data
        // otherwise send the data that was previously obtained from the store & put into the placeholders
        // avoids issue of sending in partial data - filling in one field & not the rest
        addressLine1: (homeAddressDetails.addressLine1.length > 0
          ? homeAddressDetails.addressLine1
          : homeAddress.addressLine1
        ).trim(),
        addressLine2: (homeAddressDetails.addressLine2.length > 0
          ? homeAddressDetails.addressLine2
          : homeAddress.addressLine2
        ).trim(),
        addressLine3: (homeAddressDetails.addressLine3.length > 0
          ? homeAddressDetails.addressLine3
          : homeAddress.addressLine3
        ).trim(),
        cityTown: (homeAddressDetails.cityTown.length > 0
          ? homeAddressDetails.cityTown
          : homeAddress.cityTown
        ).trim(),
        stateCounty: (homeAddressDetails.stateCounty.length > 0
          ? homeAddressDetails.stateCounty
          : homeAddress.stateCounty
        ).trim(),
        postcode: (homeAddressDetails.postcode.length > 0
          ? homeAddressDetails.postcode
          : homeAddress.postcode
        ).trim(),
        country: (homeAddressDetails.country.length > 0
          ? homeAddressDetails.country
          : homeAddress.country
        ).trim(),
      };
      // validate the data by sending the chosen input data to the addressSchema - made with the Joi package
      const validationResult = addressSchema.validate(
        {
          addressLine1: data.addressLine1,
          cityTown: data.cityTown,
          postcode: data.postcode,
          country: data.country,
        },
        { abortEarly: false } // abortEarly used to send array with each error & not just the 1st input error that fails validation
      );
      if (validationResult.error === undefined) {
        // if there is no error then add home address details to the store
        if (!homeAddress.DBLineId) {
          dispatch(addAddressDetails(data));
        } else {
          dispatch(putAddressDetails(data));
        }
      } else {
        // if there are errors, then put each error name (name of the input) into a new array
        const errorArr = [];
        validationResult.error.details.forEach((err) => {
          errorArr.push(err.path[0]);
        });
        // send the new array to the store with updateStatus action
        dispatch(
          updateStatus({
            addressId: "home", // id used to ensure message only targets this address
            updateFail: true, // updateFail set as true to show update fail message
            inputFail: errorArr, // array of input errors sent to store to add class & highligted border to the inputs with validation errors
          })
        );
      }
    }
  };

  return (
    <div>
      <h3>Home Address</h3>
      <div onSubmit={handleSubmit} className="my-form">
        <label htmlFor="addressLine1">
          *Address Line 1:
          <input
            type="text"
            name="addressLine1"
            className={
              // if the addressId is 'home' & addressLine1 has an input error
              // then add class to highlight input
              currentUpdateStatus.addressId === "home" &&
              currentUpdateStatus.inputFail.find(
                (element) => element === "addressLine1"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={homeAddress.addressLine1}
            value={homeAddressDetails.addressLine1}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="addressLine2">
          Address Line 2:
          <input
            type="text"
            name="addressLine2"
            placeholder={homeAddress.addressLine2}
            value={homeAddressDetails.addressLine2}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="addressLine3">
          Address Line 3:
          <input
            type="text"
            name="addressLine3"
            placeholder={homeAddress.addressLine3}
            value={homeAddressDetails.addressLine3}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="cityTown">
          *City / Town:
          <input
            type="text"
            name="cityTown"
            className={
              // if the addressId is 'home' & cityTown has an input error
              // then add class to highlight input
              currentUpdateStatus.addressId === "home" &&
              currentUpdateStatus.inputFail.find(
                (element) => element === "cityTown"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={homeAddress.cityTown}
            value={homeAddressDetails.cityTown}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="stateCounty">
          County:
          <input
            type="text"
            name="stateCounty"
            placeholder={homeAddress.stateCounty}
            value={homeAddressDetails.stateCounty}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="postcode">
          *Postcode:
          <input
            type="text"
            name="postcode"
            className={
              // if the addressId is 'home' & postcode has an input error
              // then add class to highlight input
              currentUpdateStatus.addressId === "home" &&
              currentUpdateStatus.inputFail.find(
                (element) => element === "postcode"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={homeAddress.postcode}
            value={homeAddressDetails.postcode}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="country">
          *Country:
          <input
            type="text"
            name="country"
            className={
              // if the addressId is 'home' & country has an input error
              // then add class to highlight input
              currentUpdateStatus.addressId === "home" &&
              currentUpdateStatus.inputFail.find(
                (element) => element === "country"
              )
                ? "fail-input-highlight"
                : null
            }
            placeholder={homeAddress.country}
            value={homeAddressDetails.country}
            onChange={handleHomeAddressDetails}
          />
        </label>
        <label htmlFor="" className="default-delivery">
          Set as Default Delivery Address -
          <input
            type="checkbox"
            name="default-delivery"
            onChange={handleCheck}
            checked={checked}
          />
        </label>

        {currentUpdateStatus.addressId === "home" &&
        currentUpdateStatus.updateComplete ? (
          // if the addressId is 'home' & updateComplete is true then show message
          <div className="update-completed">Update Completed</div>
        ) : currentUpdateStatus.addressId === "home" &&
          currentUpdateStatus.updateFail ? (
          // else, if the addressId is 'home' & updateFail is true then show message
          // else there wasn't an update & no message is shown
          <div className="update-fail">
            Update Fail&nbsp;
            {currentUpdateStatus.inputFail.length > 0 ? (
              // if there is a specific input validation failure then add this message
              <span>- please fill in the required fields</span>
            ) : null}
          </div>
        ) : null}
        <Button
          onClick={handleSubmit}
          btnMessage={homeAddress.addressLine1.length > 0 ? "Update" : "Add"}
          className={"add-address account-submit"}
        />
      </div>
    </div>
  );
};

export default HomeAddress;
