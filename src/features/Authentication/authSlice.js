import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetGetInventoryReducer } from "../Home/MyCollection/getInventorySlice";
import { domain } from "../../whichDomain/whichDomain";


// called in Login comp to check user
export const loginCheck = createAsyncThunk(
  "authentication/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/authentication/login`;
    axios({
      method: "post",
      url: url,
      data: data,
    })
      .then((res) => {
        // successful login so store userId & keep login fail as false
        thunkAPI.dispatch(
          validateLogin({
            userId: res.data.data.id,
            validatedLoginFail: false,
          })
        );
      })
      .catch((err) => {
        console.dir(err);
        // login failed so set validatedLoginFail to true to send message fail message
        thunkAPI.dispatch(validateLogin({ validatedLoginFail: true }));
      });
  }
);

export const logUserOut = createAsyncThunk(
  "logout",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(handleLogUserOut())
    thunkAPI.dispatch(resetGetInventoryReducer())
  }
)

// redux toolkit slice of store with initial state & reducers included
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    validatedLoginFail: false, // boolean used for Update Fail message
    userId: "", // dummy id for development
  },
  reducers: {
    validateLogin: (state, action) => {
      // used to add fail update message or validate login
      const { userId, validatedLoginFail } = action.payload;
      state.userId = userId;
      state.validatedLoginFail = validatedLoginFail;
    },
    handleLogUserOut: (state) => {
      state.userId = "";
      state.validatedLoginSuccess = false;
      // Remove share secret from local storage
      localStorage.clear();
    },
  },
});

// export reducers to be called in comps
export const { validateLogin, handleLogUserOut } = authSlice.actions;

// export the current store state
export const selectUserId = (state) => state.login.userId;
export const selectValidatedFail = (state) => state.login.validatedLoginFail;

export default authSlice.reducer; // export the slice to the store
