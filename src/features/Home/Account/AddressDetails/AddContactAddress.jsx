import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddressDetails,
  selectAllContactAddresses,
  updateStatus,
  selectUpdateStatus,
} from "./addressesSlice";
import { addressSchema } from "../../../../validation/validationSchemas";
import Button from "../../../Button/Button";

const AddContactAddress = () => {
  const dispatch = useDispatch(); // react-redux method

  // contact addresses found in the store
  // length is used to not show AddContactAddress comp & limit number of ContactAddresses to 3
  const contactAddresses = useSelector(selectAllContactAddresses);
  const currentUpdateStatus = useSelector(selectUpdateStatus); // current update status from the store

  const [contactAddressDetails, setContactAddressDetails] = useState({
    // local state for the form details
    addressTitle: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    cityTown: "",
    stateCounty: "",
    postcode: "",
    country: "",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
  });
  const [checked, setChecked] = useState({
    // booleans used to handle checkboxes
    addContactDetails: false,
    defaultDelivery: false,
  });

  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    // handle when updateFail is true & message shows,
    // then remove message after timeout or leave component
    var updateTimer;
    if (currentUpdateStatus.updateFail) {
      updateTimer = setTimeout(function () {
        dispatch(updateStatus({ updateFail: false, inputFail: [] }));
      }, 20000);
    }
    return () => {
      if (updateTimer !== undefined) {
        dispatch(
          updateStatus({
            updateFail: false,
            inputFail: [],
          })
        );
        clearTimeout(updateTimer);
      }
    };
  }, [currentUpdateStatus.updateFail]);

  const handleContactAddressDetails = (e) => {
    setChangeMade(true); // change occured so request will be sent
    // dynamically add contact address details from the form inputs
    setContactAddressDetails({
      ...contactAddressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactDetailsCheck = () => {
    // if addContactDetails is checked then show contact details
    setChecked({
      addContactDetails: !checked.addContactDetails,
      defaultDelivery: checked.defaultDelivery,
    });
  };

  const handleDefaultDeliveryCheck = () => {
    setChangeMade(true); // change occured so request will be sent
    // if defaultDeliveryAddress is checked then set as true
    setChecked({
      addContactDetails: checked.addContactDetails,
      defaultDelivery: !checked.defaultDelivery,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // only post if change occured = true
    if (changeMade) {
      const data = {
        addressId: "add", // id used to ensure message only targets this address
        homeAddress: false,
        defaultDelivery: checked.defaultDelivery, // Add defaultDeliveryAddress key to object with checked boolean
        ...contactAddressDetails, // spread in the local state contactDetails
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
        dispatch(addAddressDetails(data));
      } else {
        // if there are errors, then put each error name (name of the input) into a new array
        const errorArr = [];
        validationResult.error.details.forEach((err) => {
          errorArr.push(err.path[0]);
        });
        // send the new array to the store with updateStatus action
        dispatch(
          updateStatus({
            addressId: data.addressId, // id used to ensure message only targets this address
            updateFail: true, // updateFail set as true to show update fail message
            inputFail: errorArr, // array of input errors sent to store to add class & highligted border to the inputs with validation errors
          })
        );
      }
    }
  };

  return (
    <div>
      {contactAddresses.length < 3 ? ( // if there are 3 contact addresses already then dont show form to add another
        <div onSubmit={handleSubmit} className="my-form">
          <label htmlFor="addressTitle">
            Title:
            <input
              type="text"
              name="addressTitle"
              value={contactAddressDetails.addressTitle}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="addressLine1">
            *Address Line 1:
            <input
              type="text"
              name="addressLine1"
              className={
                // if the addressId is add & addressLine1 has an input error
                // then add class to highlight input
                currentUpdateStatus.addressId === "add" &&
                currentUpdateStatus.inputFail.find(
                  (element) => element === "addressLine1"
                )
                  ? "fail-input-highlight"
                  : null
              }
              value={contactAddressDetails.addressLine1}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="addressLine2">
            Address Line 2:
            <input
              type="text"
              name="addressLine2"
              value={contactAddressDetails.addressLine2}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="addressLine3">
            Address Line 3:
            <input
              type="text"
              name="addressLine3"
              value={contactAddressDetails.addressLine3}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="cityTown">
            *City / Town:
            <input
              type="text"
              name="cityTown"
              className={
                // if the addressId is add & city has an input error
                // then add class to highlight input
                currentUpdateStatus.addressId === "add" &&
                currentUpdateStatus.inputFail.find(
                  (element) => element === "cityTown"
                )
                  ? "fail-input-highlight"
                  : null
              }
              value={contactAddressDetails.cityTown}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="stateCounty">
            County:
            <input
              type="text"
              name="stateCounty"
              value={contactAddressDetails.stateCounty}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="postcode">
            *Postcode:
            <input
              type="text"
              name="postcode"
              className={
                // if the addressId is add & postcode has an input error
                // then add class to highlight input
                currentUpdateStatus.addressId === "add" &&
                currentUpdateStatus.inputFail.find(
                  (element) => element === "postcode"
                )
                  ? "fail-input-highlight"
                  : null
              }
              value={contactAddressDetails.postcode}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="country">
            *Country:
            <input
              type="text"
              name="country"
              className={
                // if the addressId is add & country has an input error
                // then add class to highlight input
                currentUpdateStatus.addressId === "add" &&
                currentUpdateStatus.inputFail.find(
                  (element) => element === "country"
                )
                  ? "fail-input-highlight"
                  : null
              }
              value={contactAddressDetails.country}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="add-contact-details" className="add-contact-details">
            Add Contact Details -
            <input
              type="checkbox"
              name="add-contact-details"
              onChange={handleContactDetailsCheck}
              checked={checked.addContactDetails}
            />
          </label>
          {checked.addContactDetails ? (
            <div className="contact-details">
              <label htmlFor="contactName">
                Contact Name:
                <input
                  type="text"
                  name="contactName"
                  value={contactAddressDetails.contactName}
                  onChange={handleContactAddressDetails}
                />
              </label>
              <label htmlFor="contactEmail">
                Contact Email:
                <input
                  type="email"
                  name="contactEmail"
                  value={contactAddressDetails.contactEmail}
                  onChange={handleContactAddressDetails}
                />
              </label>
              <label htmlFor="contactNumber">
                Contact Number:
                <input
                  type="text"
                  name="contactNumber"
                  value={contactAddressDetails.contactNumber}
                  onChange={handleContactAddressDetails}
                />
              </label>
            </div>
          ) : null}
          <label htmlFor="" className="default-delivery">
            Set as Default Delivery Address -
            <input
              type="checkbox"
              name="default-delivery"
              onChange={handleDefaultDeliveryCheck}
              checked={checked.defaultDelivery}
            />
          </label>
          {currentUpdateStatus.addressId === "add" &&
          currentUpdateStatus.updateFail ? (
            // if the addressId is add & there is an update fail then show message
            // else there wasn't an issue & no message is shown
            // updateComplete message isnt shown since the address is automatically added to the contactAddresses array
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
            btnMessage={"Add"}
            className={"add-address account-submit"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AddContactAddress;
