import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  putAddressDetails,
  updateStatus,
  selectUpdateStatus,
} from "./addressesSlice";
import { addressSchema } from "../../../../validation/validationSchemas";
import Button from "../../../Button/Button";

const EachContactAddress = (props) => {
  const contactAddress = props.address; // data for each address sent in as props from map method in ContactAddresses

  const dispatch = useDispatch(); // react-redux method

  const currentUpdateStatus = useSelector(selectUpdateStatus); // current update status from the store

  const [contactAddressDetails, setContactAddressDetails] = useState({
    // State for the form details
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
    // Booleans used to handle checkboxes
    addContactDetails: false,
    defaultDelivery: contactAddress.defaultDelivery, // populated with boolean received from db - store
  });

  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    // set the checkbox to state in db
    setChecked({
      addContactDetails:
        contactAddress.contactName ||
        contactAddress.contactEmail ||
        contactAddress.contactNumber
          ? true
          : false,
      defaultDelivery: contactAddress.defaultDelivery,
    });
  }, [
    contactAddress.defaultDelivery,
    contactAddress.contactName,
    contactAddress.contactEmail,
    contactAddress.contactNumber,
  ]);

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
      defaultDelivery: contactAddress.defaultDelivery,
    });
  };

  const handleDefaultDeliveryCheck = () => {
    setChangeMade(true); // change occured so request will be sent
    // if defaultDelivery is checked then set as true
    setChecked({
      addContactDetails: checked.addContactDetails,
      defaultDelivery: !contactAddress.defaultDelivery,
    });
  };

  const handleSubmit = () => {
    // handle the submit of the form
    // only post if change occured = true
    if (changeMade) {
      const data = {
        addressId: props.keyProp, // addressId is the key for each address obtained from the map method
        homeAddress: false, // homeAddress is preset as false
        DBLineId: contactAddress.DBLineId, // add the id found for home address in db to use in PUT request
        defaultDelivery: checked.defaultDelivery, // Add defaultDeliveryAddress key to object with checked boolean
        // if a form input has been typed into giving it a length then send the data
        // otherwise send the data that was previously obtained from the store & put into the placeholders
        // avoids issue of sending in partial data - filling in one field & not the rest
        addressTitle: (contactAddressDetails.addressTitle.length > 0
          ? contactAddressDetails.addressTitle
          : contactAddress.addressTitle
        ).trim(),
        addressLine1: (contactAddressDetails.addressLine1.length > 0
          ? contactAddressDetails.addressLine1
          : contactAddress.addressLine1
        ).trim(),
        addressLine2: (contactAddressDetails.addressLine2.length > 0
          ? contactAddressDetails.addressLine2
          : contactAddress.addressLine2
        ).trim(),
        addressLine3: (contactAddressDetails.addressLine3.length > 0
          ? contactAddressDetails.addressLine3
          : contactAddress.addressLine3
        ).trim(),
        cityTown: (contactAddressDetails.cityTown.length > 0
          ? contactAddressDetails.cityTown
          : contactAddress.cityTown
        ).trim(),
        stateCounty: (contactAddressDetails.stateCounty.length > 0
          ? contactAddressDetails.stateCounty
          : contactAddress.stateCounty
        ).trim(),
        postcode: (contactAddressDetails.postcode.length > 0
          ? contactAddressDetails.postcode
          : contactAddress.postcode
        ).trim(),
        country: (contactAddressDetails.country.length > 0
          ? contactAddressDetails.country
          : contactAddress.country
        ).trim(),
        contactName: (contactAddressDetails.contactName.length > 0
          ? contactAddressDetails.contactName
          : contactAddress.contactName
        ).trim(),
        contactEmail: (contactAddressDetails.contactEmail.length > 0
          ? contactAddressDetails.contactEmail
          : contactAddress.contactEmail
        ).trim(),
        contactNumber: (contactAddressDetails.contactNumber.length > 0
          ? contactAddressDetails.contactNumber
          : contactAddress.contactNumber
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
        dispatch(putAddressDetails(data));
      } else {
        // if there are errors, then put each error name (name of the input) into a new array
        const errorArr = [];
        validationResult.error.details.forEach((err) => {
          errorArr.push(err.path[0]);
        });
        // send the new array to the store with updateStatus action
        dispatch(
          updateStatus({
            addressId: props.keyProp, // id used to ensure message only targets this address
            updateFail: true, // updateFail set as true to show update fail message
            inputFail: errorArr, // array of input errors sent to store to add class & highligted border to the inputs with validation errors
          })
        );
      }
    }
  };

  return (
    <div onSubmit={handleSubmit} key={props.keyProp} className="my-form">
      <label htmlFor="addressTitle">
        Title:
        <input
          type="text"
          name="addressTitle"
          placeholder={contactAddress.addressTitle}
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
            // if the addressId is the props.keyProp & addressLine1 has an input error
            // then add class to highlight input
            currentUpdateStatus.addressId === props.keyProp &&
            currentUpdateStatus.inputFail.find(
              (element) => element === "addressLine1"
            )
              ? "fail-input-highlight"
              : null
          }
          placeholder={contactAddress.addressLine1}
          value={contactAddressDetails.addressLine1}
          onChange={handleContactAddressDetails}
        />
      </label>
      <label htmlFor="addressLine2">
        Address Line 2:
        <input
          type="text"
          name="addressLine2"
          placeholder={contactAddress.addressLine2}
          value={contactAddressDetails.addressLine2}
          onChange={handleContactAddressDetails}
        />
      </label>
      <label htmlFor="addressLine3">
        Address Line 3:
        <input
          type="text"
          name="addressLine3"
          placeholder={contactAddress.addressLine3}
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
            // if the addressId is the props.keyProp & city has an input error
            // then add class to highlight input
            currentUpdateStatus.addressId === props.keyProp &&
            currentUpdateStatus.inputFail.find(
              (element) => element === "cityTown"
            )
              ? "fail-input-highlight"
              : null
          }
          placeholder={contactAddress.cityTown}
          value={contactAddressDetails.cityTown}
          onChange={handleContactAddressDetails}
        />
      </label>
      <label htmlFor="stateCounty">
        County:
        <input
          type="text"
          name="stateCounty"
          placeholder={contactAddress.stateCounty}
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
            // if the addressId is the props.keyProp & postcode has an input error
            // then add class to highlight input
            currentUpdateStatus.addressId === props.keyProp &&
            currentUpdateStatus.inputFail.find(
              (element) => element === "postcode"
            )
              ? "fail-input-highlight"
              : null
          }
          placeholder={contactAddress.postcode}
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
            // if the addressId is the props.keyProp & country has an input error
            // then add class to highlight input
            currentUpdateStatus.addressId === props.keyProp &&
            currentUpdateStatus.inputFail.find(
              (element) => element === "country"
            )
              ? "fail-input-highlight"
              : null
          }
          placeholder={contactAddress.country}
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
              placeholder={contactAddress.contactName}
              value={contactAddressDetails.contactName}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="contactEmail">
            Contact Email:
            <input
              type="email"
              name="contactEmail"
              placeholder={contactAddress.contactEmail}
              value={contactAddressDetails.contactEmail}
              onChange={handleContactAddressDetails}
            />
          </label>
          <label htmlFor="contactNumber">
            Contact Number:
            <input
              type="text"
              name="contactNumber"
              placeholder={contactAddress.contactNumber}
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
      {currentUpdateStatus.addressId === props.keyProp &&
      currentUpdateStatus.updateComplete ? (
        // if the addressId is props.keyProp & updateComplete is true then show message
        <div className="update-completed">Update Completed</div>
      ) : currentUpdateStatus.addressId === props.keyProp &&
        currentUpdateStatus.updateFail ? (
        // else, if the addressId is props.keyProp & updateFail is true then show message
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
        btnMessage={"Update"}
        className={"add-address account-submit"}
      />
    </div>
  );
};

export default EachContactAddress;
