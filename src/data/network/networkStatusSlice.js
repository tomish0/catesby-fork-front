import { createSlice } from '@reduxjs/toolkit';

export const connectionSlice = createSlice({
    name: 'connectionStatus',
    initialState: navigator.onLine,
    reducers: {
        setOnline: state => {
            console.log('dispatch setOnline');
            return true
        },
        setOffline: state => {
            console.log('dispatch setOffline');
            return false
        }
    }
});

export const { setOnline, setOffline } = connectionSlice.actions;

export const selectAppConnectionStatus = state => state.connectionStatus;

export default connectionSlice.reducer;