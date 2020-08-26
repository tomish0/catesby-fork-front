import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import AllAddresses from "./AddressDetails/AllAddresses";
import "../../../css/Account.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const [showSection, setShowSection] = useState({
    // Used to be able to show/hide each section on account page
    personalDetails: true,
    allAddresses: true,
  });

  const handleShowSection = (num) => {
    // Switch used to manipulate which sections show on clicks
    switch (num) {
      case 1:
        if (num === 1) {
          setShowSection({
            personalDetails: !showSection.personalDetails,
            allAddresses: showSection.allAddresses,
          });
        }
        break;
      case 2:
        if (num === 2) {
          setShowSection({
            personalDetails: showSection.personalDetails,
            allAddresses: !showSection.allAddresses,
          });
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="account-container">
      <h2>Account</h2>
      <section className="personal-details-section">
        <h3 onClick={() => handleShowSection(1)}>
          Personal Details
          <span>
            {!showSection.personalDetails ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </span>
        </h3>
        {showSection.personalDetails ? <PersonalDetails /> : null}
      </section>
      <section className="addresses-section">
        <h3 onClick={() => handleShowSection(2)} className="addresses-title">
          Addresses
          <span>
            {!showSection.allAddresses ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </span>
        </h3>
        {showSection.allAddresses ? <AllAddresses /> : null}
      </section>
    </div>
  );
};

export default Account;
