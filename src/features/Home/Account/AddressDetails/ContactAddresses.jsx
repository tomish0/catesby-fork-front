import React from "react";
import { useSelector } from "react-redux";
import { selectAllContactAddresses } from "./addressesSlice";
import EachContactAddress from "./EachContactAddress";
import ContactAddressAdd from "./AddContactAddress";

const ContactAddresses = () => {
  // contact addresses found in the store & mapped into EachContactAddress comps
  const contactAddresses = useSelector(selectAllContactAddresses); 


  return (
    <div>
      <h3>Delivery Addresses</h3>
      {contactAddresses.map((address, i) => {
        return <EachContactAddress address={address} key={i} keyProp={i}/>;
      })}
      <ContactAddressAdd />
    </div>
  );
};

export default ContactAddresses;
