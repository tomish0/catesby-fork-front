import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { validateLogin } from "../Authentication/authSlice";
import axios from "axios";
import { domain } from "../../whichDomain/whichDomain";

// called in SignUp comp to add a user
export const addUser = createAsyncThunk(
  "user/add/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/user`;
    axios({
      method: "post",
      url: url,
      data: data,
    })
      .then((res) => {
        // successful add so set validatedLoginSuccess to true to take you into the app
        // send empty array as comp can only render properly with an array - .find() method will cause error otherwise
        thunkAPI.dispatch(
          validateSignUp({
            inputFail: [],
          })
        );
        thunkAPI.dispatch(
          validateLogin({
            userId: res.data.data.id,
            validatedLoginFail: false,
          })
        ); // action found in authSlice to log in
      })
      .catch((err) => {
        console.dir(err);
        if (err.response.status === 300) {
          // email already registered so set fail to true & emailRegistered to true
          // send empty array to inputFail as comp can only render properly with an array - .find() method will cause error otherwise
          thunkAPI.dispatch(
            validateSignUp({
              validatedLoginFail: true,
              emailRegistered: true,
              inputFail: [],
            })
          );
        } else {
          // other signUp failure so set validatedLoginFail to true to send fail message
          thunkAPI.dispatch(
            validateSignUp({
              validatedLoginFail: true,
              inputFail: [],
            })
          );
        }
      });
  }
);

// redux toolkit slice of store with initial state & reducers included
export const signUpSlice = createSlice({
  name: "signUp",
  initialState: {
    validatedLoginFail: false, // boolean used for Update Fail message
    emailRegistered: false, // boolean used to send email already registered message
    inputFail: [], // array to store the different failed inputs on front-end validation - Joi used
  },
  reducers: {
    validateSignUp: (state, action) => {
      // used to add different update statuses to the store & validate login
      const { validatedLoginFail, emailRegistered, inputFail } = action.payload;
      state.validatedLoginFail = validatedLoginFail;
      state.emailRegistered = emailRegistered;
      state.inputFail = inputFail;
    },
  },
});

export const { validateSignUp } = signUpSlice.actions; // export reducers to be called in comps

// export the current store state
export const selectValidatedFail = (state) => state.signUp.validatedLoginFail;
export const selectEmailRegistered = (state) => state.signUp.emailRegistered;
export const selectInputFail = (state) => state.signUp.inputFail;

export default signUpSlice.reducer; // export the slice to the store
