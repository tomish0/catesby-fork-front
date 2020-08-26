import { createSlice } from '@reduxjs/toolkit';

export const serverStatus = createSlice({
    name: 'serverStatus',
    initialState: 1,
    reducers: {
        setOnline: state => {
            console.log('dispatch Server Status Online');
            return 1
        },
        setOffline: state => {
            console.log('dispatch Server Status Offline');
            return 0
        }
    }
});

export const { setOnline, setOffline } = serverStatus.actions;

export const selectServerStatus = state => state.serverStatus;

export default serverStatus.reducer;