import {createSlice} from "@reduxjs/toolkit";
import appReduxStore from '../../../../store';

const initialState = {
   userData: appReduxStore.getState().auth.userData,
};

const profileSlice = createSlice({
   name: "profile",
   initialState,
   reducers: {
      setUserData: (state, action) => {
         return {
            ...state,
            userData: action.payload
         };
      }
   }
});

const {
   setUserData
} = profileSlice.actions;

export const actions = {
   setUserData,
};

export default profileSlice;
