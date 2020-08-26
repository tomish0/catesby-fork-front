import axios from 'axios';
import store from '../../app/store';

import { setOnline, setOffline, selectServerStatus } from '../server/serverStatusSlice';

/*
 * Frontend Logic for application
 *
 */
export default class axiosController {

    static setTokenData(tokenData) {
        const tokenString = JSON.stringify(tokenData)
        localStorage.setItem('token', tokenString);
        axios.defaults.headers.common = {
            'shared_secret': tokenData.sharedSecret,
            'user_id': tokenData.id
        }
    }

    static getTokenData() {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
            const tokenData = JSON.parse(tokenString);
            axios.defaults.headers.common = {
                'shared_secret': tokenData.sharedSecret,
                'user_id': tokenData.id
            }
        };
    }

    static setAxiosOptions() {
        // Request Interceptor
        axios.interceptors.request.use(config => {
            config.headers = { ...axios.defaults.headers.common, ...config.headers }
            return config;
        })

        // Response Interceptor
        axios.interceptors.response.use(res => {
            if (res.data.data) {
                if (res.data.data.sharedSecret) {
                    axiosController.setTokenData(res.data.data)
                }

                if (res.data.data.serverStatus === 0 && selectServerStatus === 1) {
                    store.dispatch(setOffline())
                }

                if (res.data.data.serverStatus === 1 && selectServerStatus === 0) {
                    store.dispatch(setOnline())
                }
            }

            return res;
        }, error => {
            return Promise.reject(error);
        });
    }

    static init() {
        console.log('Init dataController');
        axiosController.setAxiosOptions();
        axiosController.getTokenData();
    }
}
