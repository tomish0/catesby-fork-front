import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAddressDetails } from "./addressesSlice";
import HomeAddress from "./HomeAddress";
import ContactAddresses from "./ContactAddresses";

const AllAddresses = () => {
  const dispatch = useDispatch(); // react-redux method

  useEffect(() => {
    // on load of component get the current personal details from db to put into placeholders
    dispatch(getAddressDetails());
  }, []);

  return (
    <div>
      <p className="required">* - Required</p>
      <HomeAddress />
      <ContactAddresses />
    </div>
  );
};

export default AllAddresses;
