import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {domain} from "../../../../whichDomain/whichDomain"

// Called on load of AllAddresses comp with useEffect to populate the address forms with placeholder data
// & when a successful POST/PUT request completes, to put the current database data into the store & form
export const getAddressDetails = createAsyncThunk(
  "user/contact/requestStatus",
  async (userId, thunkAPI) => {
    // userId acruired on login & found in loginSlice
    const url = `${domain}/user/contact/`;
    axios({
      method: "get",
      url: url,
    })
      .then((res) => {
        const data = res.data.data; // all addresses data
        var newArr = [];
        data.forEach((address) => {
          // for each address in the array turn the defaultDelivery into a boolean, not number as stored in db
          const defaultDelivery =
            address.defaultDelivery === "1" ? true : false;
          const dataObj = {
            ...address,
            defaultDelivery: defaultDelivery,
          };
          newArr.push(dataObj);
        });
        const homeAddressIndex = newArr.findIndex(
          // with the new arrray with correct defaultDelivery, find the location of the homeAddress in array
          (address) => address.homeAddress === "1"
        );
        const homeAddress = newArr[homeAddressIndex];
        // check there is a home address in the array before performing add / slice
        if (homeAddress) {
          thunkAPI.dispatch(addHomeAddressDetails(homeAddress)); // send the homeAddress to specific state fields
          newArr.splice(homeAddressIndex, 1);
        }
        thunkAPI.dispatch(addAddressToAllContactAddresses(newArr)); // send the other addresses (with homeAddress = false/0) to array
      })
      .catch((err) => {
        if (err.response.status === 300) {
          return null;
        } else {
          console.dir(err);
        }
      });
  }
);

// called by the AddContactAddress comp to add new address or HomeAddress when data is null
export const addAddressDetails = createAsyncThunk(
  "user/contact/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/user/contact/`;
    axios({
      method: "post",
      url: url,
      data: data,
    })
      .then((res) => {
        console.dir(res);
        thunkAPI.dispatch(getAddressDetails()); // after successful POST, call GET to update store with new data in db
        thunkAPI.dispatch(
          updateStatus({
            // call updateStatus action
            addressId: data.addressId, // addressId is added to data object & sent here to ensure the update message appears under correct address
            updateComplete: true, // updateComplete: true results in a Update Complete message
            // send empty array to inputFail as no failure in POST & comp can only render properly with an array
            // .find() method will cause error otherwise
            inputFail: [],
          })
        );
      })
      .catch((err) => {
        console.dir(err);
        thunkAPI.dispatch(
          updateStatus({
            // call updateStatus action
            addressId: data.addressId, // addressId is added to data object & sent here so ensure the update message appears under correct address
            updateFail: true, // updateFail: true results in a Update Fail message
            // send empty array as inputFail is utilised for validation in the comp for input highlighting
            // & comp can only render properly with an array - .find() method will cause error otherwise
            inputFail: [],
          })
        );
      });
  }
);

// called in HomeAddress & EachContactAddress to update an address
export const putAddressDetails = createAsyncThunk(
  "user/contact/requestStatus",
  async (data, thunkAPI) => {
    // add the line id for the address in the db, needed in url & SQL statement
    // is sent in the data object from comp but found in store which is added in the GET request
    const DBLineId = data.DBLineId;
    const url = `${domain}/user/contact/${DBLineId}`;
    axios({
      method: "put",
      url: url,
      data: data,
    })
      .then((res) => {
        console.dir(res);
        thunkAPI.dispatch(getAddressDetails()); // after successful PUT, call GET to update store with new data in db
        thunkAPI.dispatch(
          updateStatus({
            // call updateStatus action
            addressId: data.addressId, // addressId is added to data object & sent here so ensure the update message appears under correct address
            updateComplete: true, // updateComplete: true results in a Update Complete message
            inputFail: [], // send empty array as no failure in PUT & comp can only render properly with an array - .find() method will cause error otherwise
          })
        );
      })
      .catch((err) => {
        console.dir(err);
        thunkAPI.dispatch(
          updateStatus({
            // call updateStatus action
            addressId: data.addressId, // addressId is added to data object & sent here so ensure the update message appears under correct address
            updateFail: true, // updateFail: true results in a Update Fail message
            // send empty array as inputFail is utilised for validation in the comp for input highlighting
            // & comp can only render properly with an array - .find() method will cause error otherwise
            inputFail: [],
          })
        );
      });
  }
);

// redux toolkit slice of store with initial state & reducers included
export const addressesSlice = createSlice({
  name: "addresses",
  initialState: {
    allContactAddresses: [], // array to store all contact addresses without homeAddress = true
    homeAddress: {
      // object to store homeAddress data
      homeAddress: true,
      DBLineId: "",
      defaultDelivery: false,
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      cityTown: "",
      stateCounty: "",
      postcode: "",
      country: "",
    },
    updateStatus: {
      // object to store update status
      addressId: "", // used to target correct address with messages
      updateComplete: false, // boolean used for Update Complete message
      updateFail: false, // boolean used for Update Fail message
      inputFail: [], // array to store the different failed inputs on front-end validation - Joi used
    },
  },
  reducers: {
    addHomeAddressDetails: (state, action) => {
      // used to add the homeAddress to object in the store
      const homeAddress = state.homeAddress;
      const {
        DBLineId,
        defaultDelivery,
        addressLine1,
        addressLine2,
        addressLine3,
        cityTown,
        stateCounty,
        postcode,
        country,
      } = action.payload;
      homeAddress.DBLineId = DBLineId;
      homeAddress.defaultDelivery = defaultDelivery;
      homeAddress.addressLine1 = addressLine1;
      homeAddress.addressLine2 = addressLine2;
      homeAddress.addressLine3 = addressLine3;
      homeAddress.cityTown = cityTown;
      homeAddress.stateCounty = stateCounty;
      homeAddress.postcode = postcode;
      homeAddress.country = country;
    },
    addAddressToAllContactAddresses: (state, action) => {
      // used to add all the contact addresses to array in the store
      state.allContactAddresses = action.payload;
    },
    updateStatus: (state, action) => {
      // used to add different update statuses to the store
      const updateStatus = state.updateStatus;
      const {
        addressId,
        updateComplete,
        updateFail,
        inputFail,
      } = action.payload;
      updateStatus.addressId = addressId;
      updateStatus.updateComplete = updateComplete;
      updateStatus.updateFail = updateFail;
      updateStatus.inputFail = inputFail;
    },
  },
});

// export reducers to be called in comps
export const {
  addHomeAddressDetails,
  addAddressToAllContactAddresses,
  updateStatus,
} = addressesSlice.actions;

// export each part of the state
export const selectHomeAddress = (state) => state.addresses.homeAddress;
export const selectAllContactAddresses = (state) =>
  state.addresses.allContactAddresses;
export const selectUpdateStatus = (state) => state.addresses.updateStatus;

export default addressesSlice.reducer; // export the slice to the store
