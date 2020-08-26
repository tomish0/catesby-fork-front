
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/Authentication/authSlice";
import signUpReducer from "../features/SignUp/signUpSlice";
import addressesReducer from "../features/Home/Account/AddressDetails/addressesSlice";
import personalDetailsSlice from "../features/Home/Account/PersonalDetails/personalDetailsSlice";
import connectionReducer from "../data/network/networkStatusSlice";
import serverStatusReducer from "../data/server/serverStatusSlice";
import getInventoryReducer from "../features/Home/MyCollection/getInventorySlice";
import singleItemReducer from "../features/Home/MyCollection/SingleItem/singleItemSlice";

export default configureStore({
  reducer: {
    login: loginReducer,
    signUp: signUpReducer,
    addresses: addressesReducer,
    personalDetails: personalDetailsSlice,
    connectionStatus: connectionReducer,
    serverStatus: serverStatusReducer,
    appOnline: connectionReducer,
    getInventory: getInventoryReducer,
    singleItem: singleItemReducer,
  },
});
