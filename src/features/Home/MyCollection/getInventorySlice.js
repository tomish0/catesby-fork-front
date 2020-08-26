import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { domain } from "../../../whichDomain/whichDomain";
import { currencyCodesToSymbols } from "../../../currencySymbols/currencySymbols";

// method to get all inventoryData for a given user on load of MyCollection
export const getInventoryData = createAsyncThunk(
  "inventory/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/inventory/all`;
    axios({
      method: "get",
      url: url,
    })
      .then((res) => {
        // change the data to reflect correct currency symbol / code
        // then add inventory data to redux state
        const data = res.data.data;
        if (data) {
          const updatedData = [];
          data.forEach((item) => {
            const newObject = {
              ...item,
              currency: currencyCodesToSymbols[item.currency]
                ? currencyCodesToSymbols[item.currency]
                : item.currency,
            };
            // if there is an image then put at front of array otherwise put it at the end
            // so Carousel will always show the items with images first
            if (newObject.image_0 !== undefined) {
              updatedData.unshift(newObject);
            } else {
              updatedData.push(newObject);
            }
          });
          thunkAPI.dispatch(addInventoryData(updatedData));
        } else {
          thunkAPI.dispatch(addInventoryData([]));
        }
      })
      .catch((err) => {
        console.dir(err);
      });
  }
);

export const getInventorySlice = createSlice({
  name: "getInventory",
  initialState: {
    data: [],
  },
  reducers: {
    addInventoryData: (state, action) => {
      state.data = action.payload;
    },
    resetGetInventoryReducer: (state) => {
      state.carouselData = [];
      state.data = [];
    },
  },
});

// export reducers to be called in comps
export const {
  addInventoryData,
  resetGetInventoryReducer,
} = getInventorySlice.actions;

// export each part of the state
export const selectInventoryData = (state) => state.getInventory.data;

export default getInventorySlice.reducer; // export the slice to the store
