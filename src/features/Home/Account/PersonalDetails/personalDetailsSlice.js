import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { domain } from "../../../../whichDomain/whichDomain";

// Called on load of PersonalDetails comp with useEffect to populate the form with placeholder data
// & when a successful POST/PUT request completes, to put the current database data into the store & form
export const getPersonalDetails = createAsyncThunk(
  "user/requestStatus",
  async (data, thunkAPI) => {
    // userId acruired on login & found in loginSlice
    const url = `${domain}/user/`;
    axios({ 
      method: "get",
      url: url,
    })
      .then((res) => {
        const data = res.data.data[0]; // name, email, phoneNumber data
        thunkAPI.dispatch(addPersonalDetails(data)); // send the personalDetails to specific state fields
      })
      .catch((err) => {
        console.dir(err);
      });
  }
);

// called in PersonalDetails comp to update the data
export const putPersonalDetails = createAsyncThunk(
  "user/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/user/`;
    axios({
      method: "put",
      url: url,
      data: data,
    })
      .then((res) => {
        thunkAPI.dispatch(getPersonalDetails()); // after successful POST, call GET to update store with new data in db
        thunkAPI.dispatch(
          // call updateStatus action
          // updateComplete: true results in a Update Complete message
          // send empty array to inputFail as comp can only render properly with an array - .find() method will cause error otherwise
          updateStatus({ updateComplete: true, inputFail: [] })
        );
      })
      .catch((err) => {
        console.dir(err);
        if (err.response.status === 400) {
          // if error status = 400, means the email already exists in the db
          // mark emailExists as true to produce a email already registered error message
          // send empty array to inputFail as comp can only render properly with an array - .find() method will cause error otherwise
          thunkAPI.dispatch(
            updateStatus({ updateFail: true, emailExists: true, inputFail: [] })
          );
        }
      });
  }
);

// redux toolkit slice of store with initial state & reducers included
export const personalDetailsSlice = createSlice({
  name: "personalDetails",
  initialState: {
    name: "",
    email: "",
    phoneNumber: "",
    updateStatus: {
      // object to store update status
      updateComplete: false, // boolean used for Update Complete message
      updateFail: false, // boolean used for Update Fail message
      emailExists: false, // boolean used to send email already registered message
      inputFail: [], // array to store the different failed inputs on front-end validation - Joi used
    },
  },
  reducers: {
    addPersonalDetails: (state, action) => {
      // used to add personalDetails to object in the store
      const { name, email, phoneNumber } = action.payload;
      state.name = name;
      state.email = email;
      state.phoneNumber = phoneNumber;
    },
    updateStatus: (state, action) => {
      // used to add different update statuses to the store
      const {
        updateComplete,
        updateFail,
        emailExists,
        inputFail,
      } = action.payload;
      state.updateStatus.updateComplete = updateComplete;
      state.updateStatus.updateFail = updateFail;
      state.updateStatus.emailExists = emailExists;
      state.updateStatus.inputFail = inputFail;
    },
  },
});

// export reducers to be called in comps
export const {
  addPersonalDetails,
  updateStatus,
} = personalDetailsSlice.actions;

// export each part of the state
export const selectPersonalDetails = (state) => state.personalDetails;
export const selectUpdateStatus = (state) => state.personalDetails.updateStatus;

export default personalDetailsSlice.reducer; // export the slice to the store
