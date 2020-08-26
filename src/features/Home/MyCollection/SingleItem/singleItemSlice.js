import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getInventoryData } from "../getInventorySlice";
import { domain } from "../../../../whichDomain/whichDomain";
import { currencyCodesToSymbols } from "../../../../currencySymbols/currencySymbols";

export const postInventoryItem = createAsyncThunk(
  "myCollection/add/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/catalogue/add`;
    axios({
      method: "post",
      url: url,
      data: data,
    })
      .then((res) => {
        if (res.status === 200) {
          // if there is a successful request
          // getInventoryData after success to ensure MyCollection has the updated inventory list
          thunkAPI.dispatch(getInventoryData());
          // restructure the data object to send back into SingleItem
          const result = {
            ...data.catalogue,
            ...data.catalogueSpecifications,
            ...data.inventory,
          };
          result.inventoryId = res.data.data.inventoryId;
          if (
            result.image_0 !== undefined &&
            result.image_0.includes("data:image/jpeg;base64,")
          ) {
            result.image_0 = `unknown_${result.catalogueUnknownId}.jpg`;
          }
          result.currency = currencyCodesToSymbols[result.currency];
          const singleItem = {
            haveData: true,
            updatedData: true,
            result: result,
            addRoute: false,
          };
          // add SingleItem object to redux state to be sent in as props from SingleItemUpdate to SingleItem
          thunkAPI.dispatch(addSingleItem(singleItem));
          window.scrollTo(0, 0);
        }
      })
      .catch((err) => {
        console.dir(err);
      });
  }
);

// method to delete a single item from inventory
export const deleteItem = createAsyncThunk(
  "myCollection/delete/requestStatus",
  async (inventoryId, thunkAPI) => {
    const url = `${domain}/inventory/${inventoryId}`;
    axios({
      method: "delete",
      url: url,
    })
      .then((res) => {
        // getInventoryData after success to ensure MyCollection has the updated inventory list
        thunkAPI.dispatch(getInventoryData());
        // set haveData to false to take user back to SearchInventory / Carousel page
        thunkAPI.dispatch(resetHaveData());
      })
      .catch((err) => {
        console.dir(err);
      });
  }
);

// method to update a single item in inventory
export const putItemDetails = createAsyncThunk(
  "myCollection/put/requestStatus",
  async (data, thunkAPI) => {
    const url = `${domain}/catalogue/unknown/update`;
    axios({
      method: "put",
      url: url,
      data: data,
    })
      .then((res) => {
        if (res.status === 200) {
          // if there is a successful request
          // getInventoryData after success to ensure MyCollection has the updated inventory list
          thunkAPI.dispatch(getInventoryData());
          // restructure the data object to send back into SingleItem
          const result = {
            ...data.catalogue,
            ...data.catalogueSpecifications,
            ...data.inventory,
          };
          if (
            result.image_0 !== undefined &&
            result.image_0.includes("data:image/jpeg;base64,")
          ) {
            result.image_0 = `unknown_${result.catalogueUnknownId}.jpg`;
          }
          result.currency = currencyCodesToSymbols[result.currency];
          const singleItem = {
            haveData: true,
            updatedData: true,
            result: result,
          };
          // add SingleItem object to redux state to be sent in as props from SingleItemUpdate to SingleItem
          thunkAPI.dispatch(addSingleItem(singleItem));
          window.scrollTo(0, 0);
        }
      })
      .catch((err) => {
        console.dir(err);
      });
  }
);

export const singleItemSlice = createSlice({
  name: "singleItem",
  initialState: {
    addRoute: false,
    haveData: false,
    result: {},
    updatedData: false,
  },
  reducers: {
    addSingleItem: (state, action) => {
      const { haveData, result, updatedData, addRoute } = action.payload;
      state.haveData = haveData;
      state.result = result;
      state.updatedData = updatedData;
      state.addRoute = addRoute;
    },
    addRoute: (state, action) => {
      state.addRoute = action.payload;
    },
    resetHaveData: (state) => {
      state.haveData = false;
    },
    updatedData: (state, action) => {
      state.updatedData = action.payload;
    },
  },
});

// export reducers to be called in comps
export const {
  addSingleItem,
  addRoute,
  resetHaveData,
  updatedData,
} = singleItemSlice.actions;

// export each part of the state
export const selectSingleItem = (state) => state.singleItem;

export default singleItemSlice.reducer; // export the slice to the store
